import { Component, OnInit } from '@angular/core';
import { Administrador } from 'src/app/models/class/administrador.class';
import { Especialista } from 'src/app/models/class/especialista.class';
import { Paciente } from 'src/app/models/class/paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit {

  usuarioLogeado!: Administrador | Paciente | Especialista;

  constructor(
    private localStorage: LocalStorageService,
  ){}

  ngOnInit(): void {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);
  }

}
