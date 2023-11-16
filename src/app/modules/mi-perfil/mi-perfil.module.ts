import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiPerfilRoutingModule } from './mi-perfil-routing.module';
import { MisHorariosComponent } from './pages/mis-horarios/mis-horarios.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MiPerfilComponent,
    MisHorariosComponent
  ],
  imports: [
    CommonModule,
    MiPerfilRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MiPerfilModule { }
