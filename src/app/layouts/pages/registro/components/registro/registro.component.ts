import { Component, OnInit } from '@angular/core';
import { Rol } from 'src/app/models/types/rol.type';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  rol: Rol | null | 'sin elegir' = 'sin elegir';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarRol(rol: Rol): void{
    this.rol = rol;
  }

}
