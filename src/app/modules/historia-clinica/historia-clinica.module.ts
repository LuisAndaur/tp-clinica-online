import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { CrearHistoriaClinicaComponent } from './pages/crear-historia-clinica/crear-historia-clinica.component';
import { VerMiHistoriaClinicaComponent } from './pages/ver-mi-historia-clinica/ver-mi-historia-clinica.component';
import { VerHistoriasClinicasComponent } from './pages/ver-historias-clinicas/ver-historias-clinicas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerHcAdminComponent } from './pages/ver-hc-admin/ver-hc-admin.component';
import { VerHcEspecialistaComponent } from './pages/ver-hc-especialista/ver-hc-especialista.component';
import { VerHcPacienteComponent } from './pages/ver-hc-paciente/ver-hc-paciente.component';


@NgModule({
  declarations: [
    CrearHistoriaClinicaComponent,
    VerMiHistoriaClinicaComponent,
    VerHistoriasClinicasComponent,
    VerHcAdminComponent,
    VerHcEspecialistaComponent,
    VerHcPacienteComponent,
  ],
  imports: [
    CommonModule,
    HistoriaClinicaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    CrearHistoriaClinicaComponent,
    VerMiHistoriaClinicaComponent,
    VerHistoriasClinicasComponent
  ],
})
export class HistoriaClinicaModule { }
