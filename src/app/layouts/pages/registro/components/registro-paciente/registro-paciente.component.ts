import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/models/class/paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TransformService } from 'src/app/services/transform.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { Foto } from 'src/app/models/class/foto.class';
import { VPACIENTE } from '../../constants/vpaciente.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.scss']
})
export class RegistroPacienteComponent implements OnInit, OnChanges {

  @Input() paciente!: Paciente;
  @ViewChild('imagen1', { static: false }) imagen1!: ElementRef;
  @ViewChild('imagen2', { static: false }) imagen2!: ElementRef;
  form!: FormGroup;
  imagenes: Array<File | null> = [];
  imagenesUrl: Array<string> = [];
  verInputs: boolean = true;

  siteKey: string = environment.recaptcha2;

  @HostListener('change', ['$event.target'])
  async emitFiles(eventTarget: any) {
    const imagen: File = eventTarget.files && eventTarget.files[0];

    if (imagen) {
      const id: string = (eventTarget as any).id;
      // console.log(id);
      if(id == 'imagen1'){
        this.imagenes![0] = imagen;
        this.imagenesUrl[0] = URL.createObjectURL(imagen);
      }else if(id == 'imagen2'){
        this.imagenes![1] = imagen;
        this.imagenesUrl[1] = URL.createObjectURL(imagen);
      }

    }
  }

  constructor(
    private swal: SwalService,
    private storage: FirestorageService,
    private transform: TransformService,
    private auth: AuthService,
    private usuario: UsuarioService,
    private spinner: SpinnerService,
  ){}

  ngOnInit(): void {
    this.iniciarFormPaciente();
  }

  ngOnChanges(): void {
    this.iniciarFormPaciente();
    if(this.paciente?.id){
      this.paciente.fotos.forEach((foto,index)=>{
        this.imagenesUrl[index] = foto.ruta!;
      });
      this.verInputs = false;
    }else{
      this.borrar();
      this.verInputs = true;
    }
  }

  enviar(): void{
    // console.log(this.form);
    // console.log(this.imagenes);
    if (this.form.valid) {
        if (this.imagenes.length == 2) {
          this.guardarPaciente();
        } else if (this.imagenes.length == 1){
          this.swal.warning("Falta una imagen");
        } else {
          this.swal.warning("Faltan las dos imagenes");
        }
    }
    else {
      this.swal.warning("El formulario aún no es válido");
    }
  }

  private guardarPaciente(): void{
    this.spinner.mostrar();
    const paciente = this.getPaciente;
    this.auth.crearUsuarioConVerificacion(this.correo?.value,this.clave?.value).then((data)=>{

      paciente.id = data.user?.uid;
      this.storage.guardarArchivos
        ([this.imagenes[0]!,this.imagenes[1]!], COLECCION.CARPETA_IMAGENES_USUARIOS_PACIENTES)
        .subscribe(urls => {
          // ? Son 2 Fotos
          // console.log(urls);
          urls.forEach(url=>{
            paciente.fotos?.push(this.getFoto(0,url));
          });
          this.usuario.setPaciente(paciente)
          .then(()=>{
            this.swal.success("Se creó el paciente");
          })
          .catch((e:Error)=>{
            this.swal.error(e.message);
          })
          .finally(()=>{
            this.borrar();
            this.auth.cerrarSesionConMensaje();
            this.spinner.ocultar();
          });
      })
    })
    .catch((e) => {
      const mensaje = this.auth.mensajesErroresAuth(e);
      if(mensaje != ''){
        this.swal.error(mensaje);
        this.spinner.ocultar();
      }
    });
  }

  private iniciarFormPaciente(): void{
    this.form = new FormGroup({
      nombre: new FormControl(this.paciente?.nombre, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.NOMBRE.MIN), Validators.maxLength(VPACIENTE.NOMBRE.MAX)]
      }),

      apellido: new FormControl(this.paciente?.apellido, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.APELLIDO.MIN), Validators.maxLength(VPACIENTE.APELLIDO.MAX)]
      }),

      edad: new FormControl(this.paciente?.edad, {
        validators: [Validators.required, Validators.min(VPACIENTE.EDAD.MIN), Validators.max(VPACIENTE.EDAD.MAX)],
      }),

      dni: new FormControl(this.paciente?.dni, {
        validators: [Validators.required, Validators.min(VPACIENTE.DNI.MIN), Validators.max(VPACIENTE.DNI.MAX)],
      }),

      obraSocial: new FormControl(this.paciente?.obraSocial, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.OBRA_SOCIAL.MIN), Validators.maxLength(VPACIENTE.OBRA_SOCIAL.MAX)]
      }),

      correo: new FormControl(this.paciente?.correo, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.CORREO.MIN), Validators.maxLength(VPACIENTE.CORREO.MAX), Validators.email]
      }),

      clave: new FormControl(this.paciente?.clave, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.CLAVE.MIN), Validators.maxLength(VPACIENTE.CLAVE.MAX)],
      }),

      repiteClave: new FormControl(this.paciente?.clave, {
        validators: [Validators.required, Validators.minLength(VPACIENTE.CLAVE.MIN), Validators.maxLength(VPACIENTE.CLAVE.MAX)],
      }),

      recaptcha: new FormControl("", {
        validators: [ Validators.required]
      }),

    },[confirmarClaveValidator(), Validators.required]);
  }

  getErrors(errores: any): Array<string> {
    return Object.keys(errores);
  }

  getFoto(posicion: 0 | 1, ruta:string): Foto{
    const foto = new Foto();
    foto.nombre = this.imagenes[posicion]?.name;
    const time: number= this.imagenes[posicion]?.lastModified || new Date().getTime();
    foto.fecha = this.transform.fechaToString(new Date(time),true,true);
    foto.ruta = ruta;
    return foto;
  }

  eliminarFoto(posicion: number): void{
    if(posicion == 0){
      this.imagen1.nativeElement.value = "";
    }
    else if(posicion == 1){
      this.imagen2.nativeElement.value = "";
    }
    this.imagenes[posicion] = null
    this.imagenesUrl[posicion] = "";
  }



  get getPaciente(): Paciente{
    const paciente = new Paciente();
    paciente.nombre = this.nombre?.value.toUpperCase();
    paciente.apellido = this.apellido?.value.toUpperCase();
    paciente.edad = this.edad?.value;
    paciente.dni = this.dni?.value;
    paciente.obraSocial = this.obraSocial?.value.toUpperCase();
    paciente.correo = this.correo?.value;
    paciente.clave = this.clave?.value;
    return paciente;
  }

  get nombre(){
    return this.form.get('nombre');
  }

  get apellido(){
    return this.form.get('apellido');
  }

  get edad(){
    return this.form.get('edad');
  }

  get dni(){
    return this.form.get('dni');
  }

  get obraSocial(){
    return this.form.get('obraSocial');
  }

  get correo(){
    return this.form.get('correo');
  }

  get clave(){
    return this.form.get('clave');
  }

  get repiteClave(){
    return this.form.get('repiteClave');
  }


  borrar(): void{

    this.form.reset();
    this.imagenes = [];
    this.imagenesUrl = [];
    if(this.imagen1){
      this.imagen1.nativeElement.value = '';
    }
    if(this.imagen2){
      this.imagen2.nativeElement.value = '';
    }

  }

}
