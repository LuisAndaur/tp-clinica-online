import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { EsEspecialistaGuard } from 'src/app/guards/es-especialista.guard';
import { MisHorariosComponent } from './pages/mis-horarios/mis-horarios.component';

const routes: Routes = [
  { path: '', component: MiPerfilComponent  },
  { path: 'mis-horarios' , component: MisHorariosComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiPerfilRoutingModule { }
