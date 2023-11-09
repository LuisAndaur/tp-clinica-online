import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { COLECCION } from '../models/constants/coleccion.constant';

@Injectable({
  providedIn: 'root'
})
export class NoLogueadoGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const usuario = this.localStorage.obtenerItem(COLECCION.LOGEADO);
      if(usuario.id){
        this.router.navigate(["/bienvenido"]);
        return false;
      }
      return true;

  }

}
