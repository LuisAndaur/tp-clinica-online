import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroTurnosAdminPipe } from './pipes/filtro-turnos-admin.pipe';
import { FiltroTurnosEspecialistaPipe } from './pipes/filtro-turnos-especialista.pipe';
import { FechaCompletaPipe } from './pipes/fecha-completa.pipe';
import { FiltroTurnosPacientePipe } from './pipes/filtro-turnos-paciente.pipe';




@NgModule({
  declarations: [
    FechaCompletaPipe,
    FiltroTurnosAdminPipe,
    FiltroTurnosEspecialistaPipe,
    FiltroTurnosPacientePipe,

  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaCompletaPipe,
    FiltroTurnosAdminPipe,
    FiltroTurnosEspecialistaPipe,
    FiltroTurnosPacientePipe
  ],
})
export class SharedModule { }
