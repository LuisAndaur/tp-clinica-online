import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { COLECCION } from '../models/constants/coleccion.constant';
import { Rol } from '../models/types/rol.type';

@Injectable({
  providedIn: 'root'
})
export class EsAdminGuard implements CanActivate {

  constructor(
              private router: Router,
              private localStorage: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const usuario = this.localStorage.obtenerItem(COLECCION.LOGEADO);
      const tipoUsurio = usuario?.rol as Rol;

      if(tipoUsurio === 'administrador'){
        return true;
      }
      this.router.navigate(["/error"]);
      return false;
  }

}
