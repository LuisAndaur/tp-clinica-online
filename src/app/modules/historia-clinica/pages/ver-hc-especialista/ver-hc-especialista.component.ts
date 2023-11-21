import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { Especialista } from 'src/app/models/class/especialista.class';
import { TurnoEspecialista } from 'src/app/models/class/turno-especialista.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-ver-hc-especialista',
  templateUrl: './ver-hc-especialista.component.html',
  styleUrls: ['./ver-hc-especialista.component.scss']
})
export class VerHcEspecialistaComponent implements OnInit {

  turnosDeEspecialista: Array<TurnoEspecialista> | null = null;
  idEspecialista: string = "";
  mostrar: null | boolean = true;

  constructor(
    private turnos: TurnosService,
    private localStorage: LocalStorageService,
    private spinner: SpinnerService
  ){}

  ngOnInit(): void {
    this.idEspecialista = (this.localStorage.obtenerItem(COLECCION.LOGEADO) as Especialista).id;
    this.spinner.mostrar();
    this.turnos.traerTurnoEspecialista(this.idEspecialista);

    this.turnos.turnosDeEspecialista
    .pipe(skip(1)).subscribe((_turnosDeEspecilista)=>{
      this.turnosDeEspecialista = _turnosDeEspecilista?.filter(t=> {
        return t.turno.historiaClinica != undefined;
      })
      this.spinner.ocultar();
    });
  }

}
