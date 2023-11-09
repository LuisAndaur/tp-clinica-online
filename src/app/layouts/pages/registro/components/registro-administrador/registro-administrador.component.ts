import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Administrador } from 'src/app/models/class/administrador.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { AuthService } from 'src/app/services/auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TransformService } from 'src/app/services/transform.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VADMINISTRADOR } from '../../constants/vadministrador.constant';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { Foto } from 'src/app/models/class/foto.class';

@Component({
  selector: 'app-registro-administrador',
  templateUrl: './registro-administrador.component.html',
  styleUrls: ['./registro-administrador.component.scss']
})
export class RegistroAdministradorComponent implements OnInit {

  @Input() administrador!: Administrador;
  @ViewChild('imagen1', { static: false }) imagen1!: ElementRef;

  form!: FormGroup;
  imagenes: Array<File | null> = [];
  imagenesUrl: Array<string> = [];
  verInputs: boolean = true;

  @HostListener('change', ['$event.target'])
  async emitFiles(eventTarget: any) {
    const imagen: File = eventTarget.files && eventTarget.files[0];

    if (imagen) {
      const id: string = (eventTarget as any).id;
      // console.log(id);
      if(id == 'imagen1'){
        this.imagenes![0] = imagen;
        this.imagenesUrl[0] = URL.createObjectURL(imagen);
      }
    }
  }


  constructor(
    private swal: SwalService,
    private storage: FirestorageService,
    private transform: TransformService,
    private auth: AuthService,
    private usuario: UsuarioService,
    private spinner: SpinnerService
  ){}

  ngOnInit(): void {
    this.iniciarFormAdministrador();
  }

  ngOnChanges(): void {
    this.iniciarFormAdministrador();
    if(this.administrador?.id){
      this.imagenesUrl[0] = this.administrador.foto.ruta!;
      this.verInputs = false;
    }else{
      this.borrar();
      this.verInputs = true;
    }
  }

  enviar(): void{

    if (this.form.valid) {
      if (this.imagenes.length == 1) {
        this.guardarAdministrador();
      } else {
        this.swal.warning("Falta la imagen");
      }
    }
    else {
      this.swal.warning("El formulario aún no es válido");
    }
  }

  private guardarAdministrador(): void{
    this.spinner.mostrar();
    const administrador = this.getAdministrador;
    this.auth.crearUsuario(this.correo?.value,this.clave?.value).then((data)=>{
    // this.auth.crearUsuario(this.correo?.value,this.clave?.value).then((data)=>{
      this.auth.cerrarSesion();
      administrador.id = data.user?.uid;
      this.storage.guardarArchivo
        (this.imagenes[0]!,COLECCION.CARPETA_IMAGENES_USUARIOS_PACIENTES)
        .subscribe(url => {
          // ? Es 1 Foto
          // console.log(url);
          administrador.foto = this.getFoto(0,url);
          this.usuario.setAdministrador(administrador)
          .then(()=>{
            this.swal.success("Se creo el administrador");
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

  private iniciarFormAdministrador(): void{
    this.form = new FormGroup({
      nombre: new FormControl(this.administrador?.nombre, {
        validators: [Validators.required, Validators.minLength(VADMINISTRADOR.NOMBRE.MIN), Validators.maxLength(VADMINISTRADOR.NOMBRE.MAX)]
      }),

      apellido: new FormControl(this.administrador?.apellido, {
        validators: [Validators.required, Validators.minLength(VADMINISTRADOR.APELLIDO.MIN), Validators.maxLength(VADMINISTRADOR.APELLIDO.MAX)]
      }),

      edad: new FormControl(this.administrador?.edad, {
        validators: [Validators.required, Validators.min(VADMINISTRADOR.EDAD.MIN), Validators.max(VADMINISTRADOR.EDAD.MAX)],
      }),

      dni: new FormControl(this.administrador?.dni, {
        validators: [Validators.required, Validators.min(VADMINISTRADOR.DNI.MIN), Validators.max(VADMINISTRADOR.DNI.MAX)],
      }),

      correo: new FormControl(this.administrador?.correo, {
        validators: [Validators.required, Validators.minLength(VADMINISTRADOR.CORREO.MIN), Validators.maxLength(VADMINISTRADOR.CORREO.MAX)]
      }),

      clave: new FormControl(this.administrador?.clave, {
        validators: [Validators.required, Validators.minLength(VADMINISTRADOR.CLAVE.MIN), Validators.maxLength(VADMINISTRADOR.CLAVE.MAX)],
      }),

      repiteClave: new FormControl(this.administrador?.clave, {
        validators: [Validators.required, Validators.minLength(VADMINISTRADOR.CLAVE.MIN), Validators.maxLength(VADMINISTRADOR.CLAVE.MAX)],
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
    this.imagenes[posicion] = null
    this.imagenesUrl[posicion] = "";
  }


  get getAdministrador(): Administrador{
    const administrador = new Administrador();
    administrador.nombre = this.nombre?.value.toUpperCase();
    administrador.apellido = this.apellido?.value.toUpperCase();
    administrador.edad = this.edad?.value;
    administrador.dni = this.dni?.value;
    administrador.correo = this.correo?.value;
    administrador.clave = this.clave?.value;
    return administrador;
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
  }

}
