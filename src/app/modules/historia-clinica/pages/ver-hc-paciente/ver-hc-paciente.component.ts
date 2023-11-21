import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { Paciente } from 'src/app/models/class/paciente.class';
import { TurnoPaciente } from 'src/app/models/class/turno-paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-ver-hc-paciente',
  templateUrl: './ver-hc-paciente.component.html',
  styleUrls: ['./ver-hc-paciente.component.scss']
})
export class VerHcPacienteComponent implements OnInit {

  turnosDePaciente: Array<TurnoPaciente> | null = null;
  idPaciente: string = "";
  mostrar: null | boolean = true;

  constructor(
    private turnos: TurnosService,
    private localStorage: LocalStorageService,
    private spinner: SpinnerService
  ){}

  ngOnInit(): void {
    this.idPaciente = (this.localStorage.obtenerItem(COLECCION.LOGEADO) as Paciente).id;
    this.spinner.mostrar();
    this.turnos.traerTurnoPaciente(this.idPaciente);

    this.turnos.turnosDePaciente
    .pipe(skip(1)).subscribe((_turnosDePaciente)=>{
      this.turnosDePaciente = _turnosDePaciente?.filter(t=> {
        return t.turno.historiaClinica != undefined;
      })
      this.spinner.ocultar();
    });
  }

}
