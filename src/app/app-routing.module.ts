import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './layouts/pages/error/error.component';
import { LoginComponent } from './layouts/pages/login/login.component';
import { BienvenidoComponent } from './layouts/pages/bienvenido/bienvenido.component';
import { NoLogueadoGuard } from './guards/no-logueado.guard';
import { EsAdminGuard } from './guards/es-admin.guard';
import { LogueadoGuard } from './guards/logueado.guard';

const routes: Routes = [
  { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },
  {
    path: 'bienvenido',
    component: BienvenidoComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ NoLogueadoGuard ]
  },
  {
    path: 'registro',
    loadChildren: () => import('./layouts/pages/registro/registro.module').then( m => m.RegistroModule),
    canActivate: [ NoLogueadoGuard ]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule) ,
    canActivate: [ EsAdminGuard ]
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./modules/mi-perfil/mi-perfil.module').then(m => m.MiPerfilModule) ,
    canActivate: [ LogueadoGuard ]
  },
  {
    path: 'turnos',
    loadChildren: () => import('./modules/turnos/turnos.module').then(m => m.TurnosModule) ,
    canActivate: [ LogueadoGuard ]
  },
  {
    path: 'historia-clinica',
    loadChildren: () => import('./modules/historia-clinica/historia-clinica.module').then(m => m.HistoriaClinicaModule) ,
    canActivate: [ LogueadoGuard ]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
