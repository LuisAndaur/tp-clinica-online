import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { Paciente } from 'src/app/models/class/paciente.class';
import { TurnoPaciente } from 'src/app/models/class/turno-paciente.class';
import { Turno } from 'src/app/models/class/turno.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.scss']
})
export class MisTurnosPacienteComponent implements OnInit {

  filtro: string = "";
  turnosDePaciente: Array<TurnoPaciente> | null = [];
  idPaciente: string = "";
  posicionDeHistoria:number = -1;
  turnosConHistoriasClinicas: Array<TurnoPaciente> | null = null;

  constructor(
    private localStorage: LocalStorageService,
    private swal: SwalService,
    private usuarios: UsuarioService,
    private spinner: SpinnerService,
    private turnos: TurnosService
  ){}

  ngOnInit(): void {
    this.idPaciente = (this.localStorage.obtenerItem(COLECCION.LOGEADO) as Paciente).id;
    this.turnos.traerTurnoPaciente(this.idPaciente);
    this.spinner.mostrar();
    this.turnos.turnosDePaciente
      .pipe(skip(1)).subscribe((_turnosDePaciente)=>{
        this.turnosDePaciente = _turnosDePaciente;
        this.spinner.ocultar();
      });
  }

  async cancelarTurno(turno: Turno){
    const respuesta = await this.swal.textarea();
    if(respuesta === null){
      this.swal.info("Usted canceló la cancelación");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se cancelo el turno");
    }else if(respuesta){
      turno.estadoTurno = "Cancelado";
      turno.comentarioPaciente = respuesta;
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          this.swal.success("Se canceló el turno");
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

  verResenia(turno: Turno){
    this.turnos.verResenia(turno);
  }

  verDiagnostico(turno: Turno){
    this.turnos.verDiagnostico(turno);
  }

  async completarEncuesta(turno: Turno){
    const respuesta = await this.swal.option(
      {"opcion1":"Si, lo haría","opcion2":"No, no lo haría"},"Encuesta","¿Usted recomendaría a la institución?");

    if(respuesta === null){
      this.swal.info("Usted cancelo la encuesta");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no elegio una opción, por ende no se cargo la encuesta");
    }else if(respuesta == 'opcion1' || respuesta == 'opcion2'){
      turno.encuestaPaciente =  respuesta == 'opcion1' ? 'Yo los recomendaría' : "Yo no los recomendaría";
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          this.swal.success("Se cancelo el turno");
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

  async calificar(turno: Turno){

    const respuesta = await this.swal.textareaTitle("¿Como calificaría al especialista?");
    if(respuesta === null){
      this.swal.info("Usted cancelo la calificación");
    }else if(respuesta === undefined){
      this.swal.warning("Usted no escribio nada, por ende no se todo en cuenta la calificación el turno");
    }else if(respuesta){
      turno.calificacionPaciente = respuesta;
      this.spinner.mostrar();
      this.turnos.modificarTurno(turno)
        .then(()=>{
          this.swal.success("Se agrego la calificación en el turno");
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

  verHistoriasClinicas(_turnoEspecialista: TurnoPaciente) {
    this.posicionDeHistoria = -1;
    this.turnosConHistoriasClinicas = this.turnosDePaciente?.filter(t=> {
      return t.turno.historiaClinica && t.turno.idPaciente == _turnoEspecialista.turno.idPaciente;
    }).map((t,index)=>{
      if(t.turno.fechaInicio == _turnoEspecialista.turno.fechaInicio){
        this.posicionDeHistoria = index;
      }
      return t;
    })!;
  }

}
