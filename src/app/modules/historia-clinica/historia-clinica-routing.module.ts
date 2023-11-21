import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerHcPacienteComponent } from './pages/ver-hc-paciente/ver-hc-paciente.component';
import { VerHcAdminComponent } from './pages/ver-hc-admin/ver-hc-admin.component';
import { VerHcEspecialistaComponent } from './pages/ver-hc-especialista/ver-hc-especialista.component';

const routes: Routes = [
  { path: 'mi-historia-clinica', component: VerHcPacienteComponent  },
  { path: 'pacientes' , component: VerHcEspecialistaComponent },
  { path: 'todas' , component: VerHcAdminComponent }
];

@NgModule({
  declarations: [],
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class HistoriaClinicaRoutingModule { }
