import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { estadoUsuario } from 'src/app/models/types/estado-usuario.type';
import { rol } from 'src/app/models/types/rol.type';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('toggleButtonNavbar', {static: true})
    toggleButtonNavbar!: ElementRef;
  usuarioLogeado: boolean = false;
  correoLogeado!: string;
  usuarioNombreCompleto: string = "";
  rol: rol | null = null;

  constructor(
    private auth: AuthService,
    private swal: SwalService,
    private router: Router,
    private spinner: SpinnerService,
    private usuario: UsuarioService
  ) {}

  ngOnInit(): void {
    this.mostrarDatosNav();
  }

  mostrarDatosNav():void {
    this.auth.usuarioLogeado().subscribe((usuario) => {
      this.correoLogeado = "";
      this.usuarioNombreCompleto = "";
      this.usuarioLogeado = false;
      this.rol = null;
      if(usuario?.email){
        this.usuario.getUsuarioAsync("correo",usuario?.email)
        .then((_usuario)=>{
          if(_usuario){
            if(_usuario.rol as rol == 'administrador'){
              this.usuarioLogeado = true;
              this.correoLogeado = _usuario.correo;
              this.usuarioNombreCompleto = `${_usuario.nombre} ${_usuario.apellido}`;
              this.rol = _usuario.rol;
            } else {
              if(usuario.emailVerified){
                if(_usuario.estado as estadoUsuario == 'aceptado'){
                  this.usuarioLogeado = true;
                  this.correoLogeado = _usuario.correo;
                  this.usuarioNombreCompleto = `${_usuario.nombre} ${_usuario.apellido}`;
                  this.rol = _usuario.rol;
                }
              }
            }
          }
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{

        })
      }
    });
  }

  cerrarNav(): void {

    if(window.innerWidth < 991) {
      this.toggleButtonNavbar.nativeElement.click();
    }
  }

  cerrarSesion(): void {
    this.cerrarNav();
    this.spinner.mostrar();
    setTimeout(() => {
      this.auth
        .cerrarSesion()
        .then(() => {
          this.router.navigate(['/bienvenido']);
        })
        .catch((e) => {
          this.swal.error(e.message);
        })
        .finally(() => {
          debugger;
          this.spinner.ocultar();
        });
    }, 750);
  }

}
