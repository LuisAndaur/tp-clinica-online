import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TurnoEspecialista } from 'src/app/models/class/turno-especialista.class';

@Component({
  selector: 'app-ver-historias-clinicas',
  templateUrl: './ver-historias-clinicas.component.html',
  styleUrls: ['./ver-historias-clinicas.component.scss']
})
export class VerHistoriasClinicasComponent implements OnInit {

  @Input() posicionDeHistoria: number = -1;
  @Input() turnosEspecialista: Array<TurnoEspecialista> = [];
  @Output() ocultar = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
  }

  ocultarHistorias(){
    this.ocultar.emit(null);
  }

}
