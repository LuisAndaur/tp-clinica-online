import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { TurnoPaciente } from 'src/app/models/class/turno-paciente.class';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-ver-hc-admin',
  templateUrl: './ver-hc-admin.component.html',
  styleUrls: ['./ver-hc-admin.component.scss']
})
export class VerHcAdminComponent implements OnInit {

  turnosDePaciente: Array<TurnoPaciente> | null = null;
  mostrar: null | boolean = true;

  constructor(
    private turnos: TurnosService,
    private spinner: SpinnerService
  ){}

  ngOnInit(): void {
    this.spinner.mostrar();
    this.turnos.traerTurnoPacienteParaAdministrador();

    this.turnos.turnosDePacienteParaAdministrador
    .pipe(skip(1)).subscribe((_turnosDePaciente)=>{
      this.turnosDePaciente = _turnosDePaciente?.filter(t=> {
        return t.turno.historiaClinica != undefined;
      })
      this.spinner.ocultar();
    });
  }

}
