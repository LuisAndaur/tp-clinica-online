import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Rol } from 'src/app/models/types/rol.type';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  @ViewChild('selectRol', {static:false}) selectRol!: ElementRef;
  rol: Rol | null | 'sin elegir' = 'sin elegir';

  constructor() { }

  ngOnInit(): void {
  }

  cambiarRol(): void{
    this.rol = this.selectRol.nativeElement.value;
  }

}
