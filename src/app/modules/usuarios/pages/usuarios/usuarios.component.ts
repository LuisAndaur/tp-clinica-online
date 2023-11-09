import { Component, OnInit } from '@angular/core';
import { Administrador } from 'src/app/models/class/administrador.class';
import { Especialista } from 'src/app/models/class/especialista.class';
import { Paciente } from 'src/app/models/class/paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { EstadoUsuario } from 'src/app/models/types/estado-usuario.type';
import { Rol } from 'src/app/models/types/rol.type';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: Array<any> = [];
  verClave: Array<boolean> = [];
  faltaCargarUsuarios: boolean = true;
  paciente: Paciente | null = null;
  especialista: Especialista | null = null;
  administrador: Administrador | null = null;
  soloVer: boolean = false;
  usuarioLogeado: any;
  verClaves: boolean = false;

  constructor(
    private swal: SwalService,
    private auth: AuthService,
    private usuario: UsuarioService,
    private spinner: SpinnerService,
    private localStorage: LocalStorageService
  ){}

  ngOnInit(): void {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);
    this.usuario.getUsuariosOrdenados('fechaRegistro','desc')
      .subscribe(usuarios=>{
        this.faltaCargarUsuarios = !usuarios;
        this.usuarios = usuarios;
        this.verClave = this.usuarios.map(a => false);
        // console.log(this.usuarios);
      })
  }

  cambiarVistaClave(posicion: number): void {
    this.verClave[posicion] = !this.verClave[posicion];
  }

  cambiarVistasDeClaves(): void {
    this.verClaves = !this.verClaves;
    this.verClave = this.verClave.map(clave => this.verClaves);
  }

  posicionesClave(clave:string ): string {
    return clave.split("").map(c=>"*").join("");
  }

  eliminar(id:string): void{
    this.spinner.mostrar();
    this.auth.eliminarUsuario(id)
      .then(()=>{
        this.usuario.eliminarUsuario(id)
          .then(()=>{
            this.swal.success("Se elimno el usuario");
          })
          .catch((e:Error)=>{
            const mensaje = this.auth.mensajesErroresAuth(e.message);
            this.swal.error(mensaje);
          })
          .finally(()=>{
            this.spinner.ocultar();
          })
      })
      .catch((e:Error)=>{
        // const mensaje = this.auth.mensajesErroresAuth(e.message);
        this.swal.error(e.message);
        this.spinner.ocultar();
      })
  }

  modificar(posicion: number, rol: Rol, soloVer: boolean): void{
    this.soloVer = soloVer;
    this.limpiarAltaRegistro();
    if(rol == 'paciente'){
      this.paciente = this.usuarios[posicion];
    }else if(rol == 'especialista'){
      this.especialista = this.usuarios[posicion];
    }else if(rol == 'administrador'){
      this.administrador = this.usuarios[posicion];
    }
  }

  ver(posicion: number, rol: Rol, soloVer: boolean): void{
    this.modificar(posicion, rol, soloVer);
  }

  private limpiarAltaRegistro(): void{
    this.paciente = null;
    this.especialista = null;
    this.administrador = null;
  }

  agregarAdministrador():void {
    this.limpiarAltaRegistro();
    this.soloVer = false;
    this.administrador = new Administrador();
  }

  agregarPaciente():void {
    this.limpiarAltaRegistro();
    this.soloVer = false;
    this.paciente = new Paciente();
  }

  agregarEspecialista():void {
    this.limpiarAltaRegistro();
    this.soloVer = false;
    this.especialista = new Especialista();
  }

  private actualizarEstado(usuario:any, estado: EstadoUsuario){
    if(usuario.estado == estado){
      this.swal.info("Sin modificar: Ya posee ese estado el usuario.");
    }else{
      this.spinner.mostrar();
      usuario.estado = estado;
      this.usuario.modificarUsuario(usuario)
        .then(()=>{
          this.swal.success("Se actualizó el estado");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        });
    }
  }

  aceptarUsuario(usuario:any):void {
    this.actualizarEstado(usuario,'aceptado');
  }
  rechazarUsuario(usuario:any):void {
    this.actualizarEstado(usuario,'rechazado');
  }

  anularUsuario(usuario:any):void {
    this.actualizarEstado(usuario,'anulado');
  }

  permitirActualizarEstado(usuario:any, estado: EstadoUsuario): boolean{
    return usuario.estado == estado;
  }

}
