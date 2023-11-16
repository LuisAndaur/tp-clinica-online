import { Component, OnInit } from '@angular/core';
import { rol } from 'src/app/models/types/rol.type';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  rol: rol | null | 'sin elegir' = 'sin elegir';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarRol(rol: rol): void{
    this.rol = rol;
  }

}
