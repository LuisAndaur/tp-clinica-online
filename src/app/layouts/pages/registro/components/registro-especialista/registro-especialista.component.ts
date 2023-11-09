import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { VESPECIALISTA } from '../../constants/vespecialista.constant';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { Rol } from 'src/app/models/types/rol.type';
import { Especialista } from 'src/app/models/class/especialista.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Especialidad } from 'src/app/models/class/especialidad.class';
import { SwalService } from 'src/app/services/swal.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { TransformService } from 'src/app/services/transform.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EspecialistaService } from 'src/app/services/especialista.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { confirmarClaveValidator } from '../../validators/clave.validator';
import { Foto } from 'src/app/models/class/foto.class';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {

  @Input() especialista!: Especialista;
  @ViewChild('imagen1', { static: false }) imagen1!: ElementRef;

  @ViewChild('selectEspecialidad', {static:false}) selectEspecialidad!: ElementRef;
  form!: FormGroup;
  formEspecialidades!: FormGroup;
  rol: Rol | null = 'especialista';//'paciente';
  imagenes: Array<File | null> = [];
  imagenesUrl: Array<string> = [];
  tiposDeEspecialidades: Array<any> = [];
  faltaCargarEspecialidades: boolean = true;
  verInputs: boolean = true;
  especialidadesDelEspecialista: Array<Especialidad> = [];

  @HostListener('change', ['$event.target'])
  async emitFiles(eventTarget: any) {
    const imagen: File = eventTarget.files && eventTarget.files[0];

    if (imagen) {
      const id: string = (eventTarget as any).id;

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
    private especialistaServicio: EspecialistaService,
    private spinner: SpinnerService,
  ){}

  ngOnInit(): void {
    this.iniciarFormEspecialista();

    this.especialistaServicio.getEspecialidades().subscribe((especialidades) => {
      this.faltaCargarEspecialidades = !especialidades;
      this.tiposDeEspecialidades = especialidades;

      if(!this.especialidad){
        this.seterSelectEspecialidades();
      }
    });
  }

  async ngOnChanges() {
    this.iniciarFormEspecialista();
    if(this.especialista?.id){
      this.imagenesUrl[0] = this.especialista.foto.ruta!;
      this.verInputs = false;
    }else{
      this.borrar();
      this.verInputs = true;
    }
  }


  private seterSelectEspecialidades(): void {

    if(this.faltaCargarEspecialidades == false
      && this.rol == 'especialista'){
        const largo = this.tiposDeEspecialidades.length -1;
        const especialidad = this.tiposDeEspecialidades[largo].especialidad;

    }
  }

  enviar(): void{

    if (this.form.valid) {
      if (this.imagenes.length == 1) {
        this.guardarEspecialista();
      } else {
        this.swal.warning("Falta la imagen");
      }
    }
    else {
      this.swal.warning("El formulario aún no es válido");
    }
  }

  private guardarEspecialista(): void{
    this.spinner.mostrar();
    const especialista = this.getEspecialista;
    this.auth.crearUsuarioConVerificacion(this.correo?.value,this.clave?.value).then((data)=>{
      this.auth.cerrarSesion();

      especialista.id = data.user?.uid;
      this.storage.guardarArchivo
        (this.imagenes[0]!,COLECCION.CARPETA_IMAGENES_USUARIOS_ESPECIALISTAS)
        .subscribe(url => {

          especialista.foto = this.getFoto(0,url);
          this.usuario.setEspecialista(especialista)
          .then(()=>{
            this.swal.success("Se creó el especialista");
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

  private iniciarFormEspecialista(): void{
    this.form = new FormGroup({
      nombre: new FormControl(this.especialista?.nombre, {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.NOMBRE.MIN), Validators.maxLength(VESPECIALISTA.NOMBRE.MAX)]
      }),

      apellido: new FormControl(this.especialista?.apellido, {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.APELLIDO.MIN), Validators.maxLength(VESPECIALISTA.APELLIDO.MAX)]
      }),

      edad: new FormControl(this.especialista?.edad, {
        validators: [Validators.required, Validators.min(VESPECIALISTA.EDAD.MIN), Validators.max(VESPECIALISTA.EDAD.MAX)],
      }),

      dni: new FormControl(this.especialista?.dni, {
        validators: [Validators.required, Validators.min(VESPECIALISTA.DNI.MIN), Validators.max(VESPECIALISTA.DNI.MAX)],
      }),

      correo: new FormControl(this.especialista?.correo, {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.CORREO.MIN), Validators.maxLength(VESPECIALISTA.CORREO.MAX), Validators.email ]
      }),

      especialidadesElegidas: new FormControl("", Validators.required),

      clave: new FormControl(this.especialista?.clave, {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.CLAVE.MIN), Validators.maxLength(VESPECIALISTA.CLAVE.MAX)],
      }),

      repiteClave: new FormControl(this.especialista?.clave, {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.CLAVE.MIN), Validators.maxLength(VESPECIALISTA.CLAVE.MAX)],
      }),

    },[confirmarClaveValidator(), Validators.required]);

    this.formEspecialidades = new FormGroup({
      especialidadAgregar: new FormControl('', {
        validators: [Validators.required, Validators.minLength(VESPECIALISTA.ESPECIALIDAD.MIN), Validators.maxLength(VESPECIALISTA.ESPECIALIDAD.MAX)]
      }),
    })
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

  agregarEspecialidad(): void{
    debugger;
    if(this.formEspecialidades.valid){
      const _especialidad = this.especialidad?.value.toUpperCase();
      if(_especialidad != undefined){
        this.tiposDeEspecialidades.forEach(e => {
          if(e.especialidad == _especialidad){
            this.swal.info("La especialidad que quiere agregar ya está disponible");
            return;
          }
        });
      }else{
        this.spinner.mostrar();
        this.especialistaServicio.setEspecialidades(this.especialidad?.value)
        .then(()=>{
          this.swal.success("Se agregó la especialidad");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })
      }
    }else{
      this.swal.info("No es valida la especialidad indicada");
    }
  }

  get getEspecialista(): Especialista{
    const especialista = new Especialista();
    especialista.nombre = this.nombre?.value.toUpperCase();
    especialista.apellido = this.apellido?.value.toUpperCase();
    especialista.edad = this.edad?.value;
    especialista.dni = this.dni?.value;
    especialista.especialidades = this.especialidadesDelEspecialista;
    especialista.correo = this.correo?.value;
    especialista.clave = this.clave?.value;
    return especialista;
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

  get especialidad(){
    return this.formEspecialidades.get('especialidadAgregar');
  }

  get especialidadesElegidas(){
    return this.form.get('especialidadesElegidas');
  }

  borrar(): void{
    this.form.reset();
    this.imagenes = [];
    this.imagenesUrl = [];
    if(this.imagen1){
      this.imagen1.nativeElement.value = '';
    }

    this.seterSelectEspecialidades();
    this.borrarEspecialidad();

  }

  sumarEspecialidad(){

    const id = this.selectEspecialidad.nativeElement.value
    const _especialidad = this.tiposDeEspecialidades.filter(e => e.id == id)[0];

    if(this.especialidadesDelEspecialista.some(e=> e.id == _especialidad.id)){
      this.swal.info("Usted ya tiene esta especialidad");
    }else{
      this.especialidadesDelEspecialista.push(_especialidad);
      const _especialidades = this.especialidadesDelEspecialista.map(e => e.especialidad).join(", ");
      this.especialidadesElegidas?.setValue(_especialidades);
    }

  }

  borrarEspecialidad(){
    this.especialidadesDelEspecialista = [];
    this.especialidadesElegidas?.setValue("");
  }

}
