import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { RegistroAdministradorComponent } from './components/registro-administrador/registro-administrador.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';



@NgModule({
  declarations: [
    RegistroComponent,
    RegistroPacienteComponent,
    RegistroAdministradorComponent,
    RegistroEspecialistaComponent
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ],
  exports: [
    RegistroPacienteComponent,
    RegistroAdministradorComponent,
    RegistroEspecialistaComponent
  ]
})
export class RegistroModule { }
