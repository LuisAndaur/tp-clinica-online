import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as FirebaseAuth from 'firebase/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private swal: SwalService

    ) {}

  iniciarSesion(correo: string, clave: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(correo, clave);
  }

  cerrarSesion(): Promise<any> {
    localStorage.clear();
    return this.auth.signOut();
  }

  crearUsuario(correo: string, clave: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(correo, clave);
  }

  usuarioLogeado(): Observable<any> {
    return this.auth.authState;
  }

  async enviarCorreoDeVerificacion() {
    return (await this.auth.currentUser)?.sendEmailVerification();
  }

  async crearUsuarioConVerificacion(correo: string, clave: string): Promise<any> {
    const resultado = await this.crearUsuario(correo, clave);
    this.enviarCorreoDeVerificacion();
    return resultado;
  }

  eliminarUsuario(id:string) {
    return FirebaseAuth.deleteUser(id as any);
  }

  mensajesErroresAuth(e:any):string{
    let mensajeError = '';
    switch (e.code) {
      case 'auth/invalid-email':
        mensajeError = "Formato de correo electrónico inválido.";
        break;
      case 'auth/missing-password':
        mensajeError = "Falta ingresar la contraseña.";
        break;
      case 'auth/weak-password':
        mensajeError = "La contraseña debe contener al menos 6 caracteres.";
        break;
      case 'auth/email-already-in-use':
        mensajeError = "El correo electrónico ingresado ya está en uso.";
        break;
      default:
        mensajeError = e.code;
        break;
    }
    return mensajeError;
  }

  cerrarSesionConMensaje(): void{
    this.cerrarSesion();
    this.swal.success("El registro se ha completado. Por favor, ingrese con sus datos");
    this.router.navigate(['/login']);
  }
}
