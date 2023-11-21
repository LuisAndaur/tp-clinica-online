import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { Especialista } from 'src/app/models/class/especialista.class';
import { HistoriaClinica } from 'src/app/models/class/historia-clinica.class';
import { TurnoEspecialista } from 'src/app/models/class/turno-especialista.class';
import { Turno } from 'src/app/models/class/turno.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.scss']
})
export class MisTurnosEspecialistaComponent implements OnInit {

  filtro: string = "";
  turnosEspecialista: Array<TurnoEspecialista> | null = [];
  mostrarGenerarHistoriaClinica: boolean = false;
  // historiaClinica: HistoriaClinica | null = null;
  turno: Turno | null = null;
  turnosConHistoriasClinicas: Array<TurnoEspecialista> | null = null;
  posicionDeHistoria:number = -1;
  idEspecialista: string = "";

  constructor(
    private localStorage: LocalStorageService,
    private swal: SwalService,
    private spinner: SpinnerService,
    private turnos: TurnosService
  ){}

  ngOnInit(): void {
    this.idEspecialista = (this.localStorage.obtenerItem(COLECCION.LOGEADO) as Especialista).id;

    this.spinner.mostrar();
    this.turnos.traerTurnoEspecialista(this.idEspecialista);

    this.turnos.turnosDeEspecialista
      .pipe(skip(1)).subscribe((_turnosDeEspecilista)=>{
      this.turnosEspecialista = _turnosDeEspecilista;
      this.spinner.ocultar();
    });
  }

  async cancelarTurno(turno: Turno){
    const respuesta = await this.swal.textarea();
    if(respuesta === null){
      this.swal.info("Usted cancelo la cancelación");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se cancelo el turno");
    }else if(respuesta){
      turno.estadoTurno = "Cancelado";
      turno.comentarioEspecialista = respuesta;
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          this.swal.success("Se canceló el turno");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(() => {
          this.spinner.ocultar();
        })
    }else{
      this.swal.error("Llame a el servicio técnico");
    }
  }

  async rechazarTurno(turno: Turno){
    const respuesta = await this.swal.textarea();
    if(respuesta === null){
      this.swal.info("Usted canceló la petición de rechazar");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se rechazo el turno");
    }else if(respuesta){
      turno.estadoTurno = "Rechazado";
      turno.comentarioEspecialista = respuesta;
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{

          this.swal.success("Se rechazó el turno");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })

    }else{
      this.swal.error("Llame a el servicio técnico");
    }
  }

  async aceptarTurno(turno: Turno){
    turno.estadoTurno = "Aceptado";
    this.spinner.mostrar();
    await this.turnos.modificarTurno(turno)
      .then(async()=>{
        // await this.traerTurnoEspecialista();
        this.swal.success("Se aceptó el turno");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
  }

  private async completarReseña(turno: Turno) {
    const respuesta = await this.swal.textarea();
    if(respuesta === null){
      this.swal.info("Usted cancelo completar la reseña");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se hizo la reseña el turno");
    }else if(respuesta){
      turno.estadoTurno = "Realizado";
      turno.reseniaEspecialista = respuesta;
      await this.completarDiagnostico(turno);
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          // this.traerTurnoEspecialista();
          this.swal.success("Reseña completa!");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })
    }else{
      this.swal.error("Llame a el servicio técnico");
    }
  }

  private async completarComentarioFinaliza(turno: Turno) {
    const respuesta = await this.swal.textareaTitle("Escriba su comentario/reseña");
    if(respuesta === null){
      this.swal.info("Usted cancelo completar el comentario");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se hizo el comentario el turno");
    }else if(respuesta){
      turno.estadoTurno = "Realizado";
      turno.comentarioEspecialista = respuesta;
      await this.completarDiagnostico(turno);
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          // this.traerTurnoEspecialista();
          this.swal.success("Reseña completa!");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })
    }else{
      this.swal.error("Llame a el servicio técnico");
    }
  }

  async finalizarTurno(turno: Turno){

    const respuesta = await this.swal.option(
      {"opcion1":"Comentario","opcion2":"Reseña"},"Elegir","Comentario o Reseña");

    if(respuesta === null){
      this.swal.info("Usted cancelo la finalización");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no elegio una opción, por ende no se finalizo el turno");
    }else if(respuesta == 'opcion1'){// ? comentario
      this.completarComentarioFinaliza(turno);
    }else if(respuesta == 'opcion2'){// ? reseña
      this.completarReseña(turno);
    }else{
      this.swal.error("Llame a el servicio técnico");
    }

  }

  verResenia(turno: Turno){
    this.turnos.verResenia(turno);
  }

  verDiagnostico(turno: Turno){
    this.turnos.verDiagnostico(turno);
  }

  private async completarDiagnostico(turno: Turno){
    const respuesta = await this.swal.textareaTitle("Indique su diagnóstico");
    if(respuesta === null){
      this.swal.info("Usted cancelo completar el diagnostico");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se hizo guardo el diagnostico el turno");
    }else if(respuesta){
      turno.estadoTurno = "Realizado";
      turno.diagnosticoEspecialista = respuesta;
      this.spinner.mostrar();
      await this.turnos.modificarTurno(turno)
        .then(async()=>{
          // await this.traerTurnoEspecialista();
          this.swal.success("Se finalizo el turno");
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        })
    }else{
      this.swal.error("Llame a el servicio técnico");
    }
  }

  completarHistoriaClinica(turno: Turno){
    this.turno = turno;
    this.mostrarGenerarHistoriaClinica = true;
  }

  async setearHistoriaClinica(historiaClinica: HistoriaClinica){
    debugger;
    if(this.turno){
      this.turno.historiaClinica = historiaClinica
      await this.turnos.modificarTurno(this.turno)
        .then(()=>{
          this.swal.success("Se completo la historia clinica");
          this.mostrarGenerarHistoriaClinica = false;
        })
        .catch((e:Error)=>{
          this.swal.error(e.message);
        })
        .finally(()=>{
          this.spinner.ocultar();
        });
    }else{
      this.swal.error("Algo sucedio mal");
    }
  }

  cancelarSeteoHistoriaClinica(emit: boolean){
    this.mostrarGenerarHistoriaClinica = false;
    this.swal.info("Se cancelo el completar la historia clinica");
  }

  verHistoriasClinicas(_turnoEspecialista: TurnoEspecialista) {
    this.posicionDeHistoria = -1;
    this.turnosConHistoriasClinicas = this.turnosEspecialista?.filter(t=> {
      return t.turno.historiaClinica && t.turno.idPaciente == _turnoEspecialista.turno.idPaciente;
    }).map((t,index)=>{
      if(t.turno.fechaInicio == _turnoEspecialista.turno.fechaInicio){
        this.posicionDeHistoria = index;
      }
      return t;
    })!;
  }

}
