import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { TurnoCompleto } from 'src/app/models/class/turno-completo.class';
import { Turno } from 'src/app/models/class/turno.class';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-turnos-administrador',
  templateUrl: './turnos-administrador.component.html',
  styleUrls: ['./turnos-administrador.component.scss']
})
export class TurnosAdministradorComponent implements OnInit {

  filtro: string = "";
  turnosDePaciente: Array<TurnoCompleto> | null = [];

  constructor(
    private swal: SwalService,
    private spinner: SpinnerService,
    private swalServicio: SwalService,
    private turnos: TurnosService
  ){}

  ngOnInit(): void {
    this.turnos.traerTurnoCompleto();
    this.spinner.mostrar();
    this.turnos.turnosCompleto
      .pipe(skip(1)).subscribe((_turnosCompleto)=>{
        this.turnosDePaciente = _turnosCompleto;
        this.spinner.ocultar();
      });
  }

  async cancelarTurno(turno: Turno){
    const respuesta = await this.swalServicio.textarea();

    if(respuesta === undefined){
      this.swal.warning("El turno no se canceló, debe dejar un comentario.");
    }else if(respuesta){
      turno.estadoTurno = "Cancelado";
      turno.comentarioAdministrador = respuesta;
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          this.swal.success("Turno cancelado");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })
    }else{
      this.swal.error("Llame a el servicio técnico.");
    }
  }

}
