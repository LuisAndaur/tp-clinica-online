import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { EstadoUsuario } from 'src/app/models/types/estado-usuario.type';
import { Rol } from 'src/app/models/types/rol.type';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private auth: AuthService,
    private swal: SwalService,
    private router: Router,
    private spinner: SpinnerService,
    private localStorage: LocalStorageService,
    private usuario: UsuarioService,
  ) {}

  ngOnInit(): void {

    this.form = new FormGroup({
      correo: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      clave: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur',
      }),
    });
  }
  async enviarForm(): Promise<void> {

    this.spinner.mostrar();
    await this.auth
      .iniciarSesion(this.correo?.value, this.clave?.value)
      .then(async (data) => {
        const verificado = data.user?.emailVerified;

        await this.usuario.getUsuarioAsync('correo', this.correo?.value)
          .then(async usuario=> {
            if(usuario){
              const rol = (usuario as any).rol as Rol;
              if(rol == 'administrador'){
                await this.registrarFecha(usuario.correo);
                this.swal.success('Acceso concedido');
                this.router.navigate(['/usuarios/administrar-usuarios']);
                this.localStorage.guardarItem(COLECCION.LOGEADO, usuario);
              }else{
                if(verificado){
                  const estado = usuario.estado as EstadoUsuario;
                  if(estado == 'aceptado'){
                    await this.registrarFecha(usuario.correo);
                    this.swal.success('Acceso concedido');
                    this.router.navigate(['/bienvenido']);
                    this.localStorage.guardarItem(COLECCION.LOGEADO, usuario);
                  }
                  else if(estado == 'pendiente'){
                    this.swal.info("El administrador no activó su cuenta");
                  }
                  else if(estado == 'anulado'){
                    this.swal.info("Su cuenta esta anulada temporalmente");
                  }
                  else if(estado == 'rechazado'){
                    this.swal.info("Su cuenta ha sido rechazada");
                  }
                }else{
                  this.auth.cerrarSesion();
                  this.swal.info("Usted no validó el correo electrónico aún");
                }
              }
            }
            else{
              this.swal.error("Comuniquese con servicio tecnico");
            }
          })
          .catch((e:Error)=>{
            this.swal.error(e.message);
          })
          .finally(()=>{
            this.form.reset();
            this.spinner.ocultar();
          })

      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/network-request-failed':
            this.swal.warning('No tiene conexión a internet');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.swal.error('Correo electrónico y/o contraseña incorrecta');
            break;
          default:
            this.swal.error('Error desconocido');
            break;
        }
        this.spinner.ocultar();
      })
  }

  private async registrarFecha(correo: string){
    await this.usuario.setFechaIngreso(correo)
      .then(()=>{
        this.swal.info("Se registro la hora de ingreso");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{

      })
  }

  get correo() {
    return this.form.get('correo');
  }

  get clave() {
    return this.form.get('clave');
  }

  completarDatos(rol:'paciente' | 'especialista' | 'administrador') {
    if(rol == 'paciente'){
      this.form.controls['correo'].setValue('yirzuritru@gufum.com');
      this.form.controls['clave'].setValue('123456');
    }else if(rol == 'especialista'){
      this.form.controls['correo'].setValue('vadrovaydu@gufum.com');
      this.form.controls['clave'].setValue('123456');
    }else if(rol == 'administrador'){
      this.form.controls['correo'].setValue('admin@clinica.com');
      this.form.controls['clave'].setValue('123456');
    }else{
      this.swal.error("No esta implementado");
    }
  }
}
