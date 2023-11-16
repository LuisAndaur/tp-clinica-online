import { Component, OnInit } from '@angular/core';
import { Administrador } from 'src/app/models/class/administrador.class';
import { Especialista } from 'src/app/models/class/especialista.class';
import { Paciente } from 'src/app/models/class/paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {

  usuarioLogeado!: Especialista | Paciente | Administrador | any;

  constructor(
    private localStorage: LocalStorageService
    )
  {}

  ngOnInit(): void {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);

  }

}
