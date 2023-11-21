import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MisTurnosPacienteComponent } from './pages/mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from './pages/mis-turnos-especialista/mis-turnos-especialista.component';
import { TurnosAdministradorComponent } from './pages/turnos-administrador/turnos-administrador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoriaClinicaModule } from '../historia-clinica/historia-clinica.module';



@NgModule({
  declarations: [
    SolicitarTurnoComponent,
    MisTurnosComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent,
    TurnosAdministradorComponent,

  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HistoriaClinicaModule

  ]
})
export class TurnosModule { }
