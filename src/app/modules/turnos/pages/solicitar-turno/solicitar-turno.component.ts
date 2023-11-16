import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Administrador } from 'src/app/models/class/administrador.class';
import { Especialidad } from 'src/app/models/class/especialidad.class';
import { Especialista } from 'src/app/models/class/especialista.class';
import { Paciente } from 'src/app/models/class/paciente.class';
import { Turno } from 'src/app/models/class/turno.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { estadoTurno } from 'src/app/models/types/estado-turno.type';
import { EspecialistaService } from 'src/app/services/especialista.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

const MAX_DIAS = 15;

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  filtroEspecialidad: string = "";
  filtroEspecialista: Especialista | null = null;
  usuarioLogeado!: Paciente | Especialista | Administrador;
  especialistas: Array<Especialista> | null = null;
  especialistasFiltrados: Array<Especialista> | null = null;
  pacientes: Array<Paciente> | null = null;
  especialidades: Array<Especialidad> | null = null;
  turnos : Array<Turno> | null = null;
  unsubTurnos!:  any;
  idUsuario: string = "";
  pacienteElegido: Paciente | null = null;

  constructor(
    private localStorage: LocalStorageService,
    private swal: SwalService,
    private usuarios: UsuarioService,
    private turnosService: TurnosService,
    private spinner: SpinnerService,
    private especialista: EspecialistaService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    debugger;
    this.spinner.mostrar();
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);

    if(this.usuarioLogeado.rol == 'paciente'){
      this.pacienteElegido = this.usuarioLogeado as Paciente;

    }else if(this.usuarioLogeado.rol == 'administrador'){

      this.usuarios.getUsuariosFiltrado("rol","paciente")
      .subscribe((_usuarios)=>{
        this.pacientes = _usuarios as Array<Paciente>;
      });

    }else{
      this.swal.error("Se ha producido un error");
      this.router.navigate(['/error']);
    }

    this.usuarios.getUsuariosFiltrado("rol","especialista")
      .subscribe((_usuarios)=>{
        this.especialistas = _usuarios as Array<Especialista>;
      });

    this.especialista.getEspecialidades()
      .subscribe((_especialidades)=>{

        this.especialidades = _especialidades as Array<Especialidad>;

      });
    this.spinner.ocultar();
  }

  elegirEspecialidad(especialidad: Especialidad){

    this.filtroEspecialidad = especialidad.especialidad;
    this.filtroEspecialista = null;
    this.turnos = null;
    this.filtrarEspecialistas(this.especialistas);
  }

  elegirEspecialista(especialista: Especialista){
    debugger;
    this.filtroEspecialista = especialista;
    this.trerTurnos();

  }

  elegirPaciente(paciente: Paciente){
    this.pacienteElegido = paciente;
  }

  private async trerTurnos(){
    this.unsubTurnos = this.turnosService.getTurnosEspecialistaYEspecialidad(this.filtroEspecialista!.id,this.filtroEspecialidad)
    .subscribe((_turnos=>{
      console.log("TURNOS: ",_turnos);
      debugger;
      // Obtener la fecha y hora dentro de 15 días
      const fechaActual = new Date().getTime();
      const fechaAFuturo = new Date();
      fechaAFuturo.setDate(fechaAFuturo.getDate() + MAX_DIAS);
      const fechaLimite = fechaAFuturo.getTime();

      this.turnos = _turnos as Array<Turno>;
      this.turnos = this.turnos
        ?.filter(turno => {
          return turno.fechaFinal < fechaLimite && turno.fechaInicio > fechaActual;
        });
      this.turnos?.sort((a,b)=> a.fechaInicio - b.fechaInicio);

      // console.log(this.turnos);

      this.unsubTurnos.unsubscribe();
    }))

    return await this.unsubTurnos;

  }

  elegirTurno(turno: Turno) {
    this.spinner.mostrar();

    turno.idPaciente = this.pacienteElegido?.id!;
    turno.estadoTurno = 'Reservado';

    this.turnosService.modificarTurno(turno)
      .then(()=>{

        const posibilidades : Array<estadoTurno> = ['Libre','Cancelado','Rechazado'];

        //TODO ver que se puede hacer de otra forma, tal vez llamar nuevamente al observable
        this.turnos = this.turnos?.filter(turno => {
          return turno.estadoTurno == posibilidades[0]
          || turno.estadoTurno == posibilidades[1]
          || turno.estadoTurno == posibilidades[2]
        })!;

        this.swal.success("El turno fue reservado");

      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
  }

  filtrarEspecialistas( especialistas: Array<Especialista> | null){

    this.especialistasFiltrados = [];
    this.filtroEspecialista
    if(especialistas!=null){
      especialistas.forEach( especialista => {
        especialista.especialidades.forEach( especialidad => {
          if(this.filtroEspecialidad == especialidad.especialidad){
            this.especialistasFiltrados?.push(especialista);
          }
        })
      })
    }

    console.log(this.especialistasFiltrados);
    if(this.especialistasFiltrados.length == 0){
      this.especialistasFiltrados = null;
    }
    console.log(this.especialistasFiltrados);
  }


}
