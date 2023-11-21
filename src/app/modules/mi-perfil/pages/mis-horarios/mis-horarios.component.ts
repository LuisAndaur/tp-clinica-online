import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Especialista } from 'src/app/models/class/especialista.class';
import { Horarios } from 'src/app/models/class/horarios.class';
import { Turno } from 'src/app/models/class/turno.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { EDia } from 'src/app/models/enums/dia.enum';
import { dia } from 'src/app/models/types/dia.type';
import { duracion } from 'src/app/models/types/duracion.type';
import { horarioSabadoFinal } from 'src/app/models/types/horario-sabado-final.type';
import { horarioSabadoInicio } from 'src/app/models/types/horario-sabado-inicio.type';
import { horarioSemanaFinal } from 'src/app/models/types/horario-semana-final.type';
import { horarioSemanaInicio } from 'src/app/models/types/horario-semana-inicio.type';
import { TurnosService } from 'src/app/services/turnos.service';
import { EspecialistaService } from 'src/app/services/especialista.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SwalService } from 'src/app/services/swal.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.scss']
})
export class MisHorariosComponent implements OnInit {

  usuarioLogeado!: Especialista;
  dias: Array<dia> = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horariosVistaInicio: Array<horarioSemanaInicio> = [];
  horariosVistaFinal: Array<horarioSemanaFinal> = [];
  horariosSemanaInicio: Array<horarioSemanaInicio> = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  horariosSemanaFinal: Array<horarioSemanaFinal> = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  horariosSabadoInicio: Array<horarioSabadoInicio> = [8, 9, 10, 11, 12, 13];
  horariosSabadoFinal: Array<horarioSabadoFinal> = [9, 10, 11, 12, 13, 14];
  duraciones: Array<duracion> = [ 30, 60 ];
  form!: FormGroup;
  horarios!: Horarios;

  constructor(
        private localStorage: LocalStorageService,
        private swal: SwalService,
        private usuarios: UsuarioService,
        private spinner: SpinnerService,
        private especialistaServicio: EspecialistaService,
        private turnos: TurnosService,

    )
  {}

  ngOnInit(): void {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);

    console.log(this.usuarioLogeado);
    this.ordenarTodosLosHorarios();

    this.seteardia("Lunes");
    this.inicarFormulario();

  }


  inicarFormulario(){
    this.form = new FormGroup({
      especialidades: new FormControl(this.usuarioLogeado.especialidades[0].id, Validators.required),
      dias: new FormControl(1, Validators.required),
      horariosInicio: new FormControl(this.horariosVistaInicio[0], Validators.required),
      horariosFinal: new FormControl(this.horariosVistaFinal[0], Validators.required),
      duraciones: new FormControl(this.duraciones[0], Validators.required),
    });
  }

  get fespecialidades(){
    return this.form.get('especialidades');
  }
  get fdias(){
    return this.form.get('dias');
  }
  get fhorariosInicio(){
    return this.form.get('horariosInicio');
  }
  get fhorariosFinal(){
    return this.form.get('horariosFinal');
  }
  get fduraciones(){
    return this.form.get('duraciones');
  }

  private setearHorarioSemana(){
    this.horariosVistaInicio = this.horariosSemanaInicio;
    this.horariosVistaFinal = this.horariosSemanaFinal;
  }

  private setearHorariosSabado(){
    this.horariosVistaInicio = this.horariosSabadoInicio;
    this.horariosVistaFinal = this.horariosSabadoFinal;
  }

  cambiarDia(event:any){
    this.seteardia(event.target.value);
  }

  private seteardia(dia: dia){
    if(dia == 'Sábado'){
      this.setearHorariosSabado();
    }else{
      this.setearHorarioSemana();
    }
  }

  enviar(){
    debugger;
    if(this.form.valid){

      const horarios = this.getHorarios();
      const respuesta = this.especialistaServicio.validarHorarios(horarios)
      if(respuesta[0]) {
        if(!this.usuarioLogeado?.horarios){
          this.usuarioLogeado.horarios = [];
        }
        if(this.especialistaServicio.validarTurno(horarios.diaNumero,horarios.horaInicio,horarios.horaFinal,this.usuarioLogeado.horarios)){

          if(horarios.duracion == 30){
            const turnos = this.turnos.turnos30minutos(horarios.horaInicio,horarios.horaFinal,horarios.duracion);
            const turnosParseados = this.turnos.turnosParseados(turnos,horarios.diaNumero);
            this.actualizarEspecialista(horarios,turnosParseados);
          }else if(horarios.duracion == 60){
            const turnos = this.turnos.turnos60minutos(horarios.horaInicio,horarios.horaFinal,horarios.duracion);
            const turnosParseados = this.turnos.turnosParseados(turnos,horarios.diaNumero);
            this.actualizarEspecialista(horarios,turnosParseados);
          }else{
            this.swal.error("Se a utilizado otra duración que no esta en el sistema, llamar a servicio ténico");
          }
        }else{
          this.swal.error("Se superpone este horario con otro que ya declaro");
        }
      } else {
        this.swal.error(respuesta[1] as string);
      }
    }else{
      this.swal.info("No es válido el formulario")
    }
  }

  borrar(){
    this.form.reset();
  }


  private getHorarios(): Horarios{
    const horarios = new Horarios();
    horarios.dia = this.dias[this.fdias?.value-1];
    horarios.diaNumero = parseInt(this.fdias?.value) as EDia;

    // TODO : ahora funciona pero ver porque al principio son numeros y luego strings
    horarios.horaInicio = parseInt(this.fhorariosInicio?.value) as horarioSemanaInicio;
    horarios.horaFinal = parseInt(this.fhorariosFinal?.value) as horarioSemanaFinal;

    horarios.duracion = parseInt(this.fduraciones?.value) as duracion;
    const especialidad = this.usuarioLogeado.especialidades.filter(e => e.id == this.fespecialidades?.value)[0];
    horarios.especialidad = especialidad;
    return horarios;
  }



  private ordenarTodosLosHorarios() {
    this.usuarioLogeado?.horarios?.sort(this.especialistaServicio.ordenarHorarios);
  }


  private actualizarEspecialista(horarios: Horarios, turnos: Array<Turno>) {
    this.usuarioLogeado.horarios.push(horarios);
    this.spinner.mostrar();
    this.usuarios.updateEspecialista(this.usuarioLogeado,this.usuarioLogeado.id)
      .then(()=>{
        this.localStorage.guardarItem(COLECCION.LOGEADO,this.usuarioLogeado);
        this.ordenarTodosLosHorarios();
        this.swal.success("Se guardo el horario");


        turnos.flat().forEach((turno,index) => {
          turno.idEspecialista = this.usuarioLogeado.id;
          turno.especialidad = horarios.especialidad;
          this.turnos.setTurno(turno)
            .then(()=>{

            })
            .catch((e:Error)=>{
              this.swal.error(e.message);
            })
            .finally(()=>{
              if(index == turnos.length -1 ){
                this.spinner.ocultar();
                this.swal.success("Se generaron los turnos");
              }
            })
        });

      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
        this.spinner.ocultar();
      })

  }

}
