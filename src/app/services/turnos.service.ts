import { Injectable } from '@angular/core';
import { Especialidad } from '../models/class/especialidad.class';
import { LocalStorageService } from './local-storage.service';
import { UsuarioService } from './usuario.service';
import { COLECCION } from '../models/constants/coleccion.constant';
import { Turno } from '../models/class/turno.class';
import { duracion } from '../models/types/duracion.type';
import { EDia } from '../models/enums/dia.enum';
import { Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { estadoTurno } from '../models/types/estado-turno.type';
import { Especialista } from '../models/class/especialista.class';
import { BehaviorSubject, take } from 'rxjs';
import { TurnoCompleto } from '../models/class/turno-completo.class';
import { Paciente } from '../models/class/paciente.class';

const SEMANAS = 5;

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private usuarioLogeado!: Especialidad;
  private colleccionTurnos: any;
  turnosCompleto: BehaviorSubject<Array<TurnoCompleto>> = new BehaviorSubject<Array<TurnoCompleto>>([]);

  constructor(
    private localStorage: LocalStorageService,
    private firestore: Firestore,
    private usuarios: UsuarioService,
    )
  {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);
    this.colleccionTurnos = collection(this.firestore,COLECCION.TURNOS);
  }

  getTurnosEspecialistaYEspecialidad(idEspecialista: string, especialidad: string){
    debugger;
    const posibilidades : Array<estadoTurno> = ['Libre'];

    const q = query(this.colleccionTurnos,
      where('idEspecialista', '==', idEspecialista),
      where('especialidad.especialidad', '==', especialidad),
      where('estadoTurno', 'in', posibilidades),
      // orderBy('fechaInicio', 'asc'),
      );
    return collectionData(q, { idField: 'id' });
  }


  setTurnos(turnos: Array<Turno>){

    return addDoc(this.colleccionTurnos,{...turnos});
  }

  setTurno(turno: Turno){

    return addDoc(this.colleccionTurnos,{...turno});
  }

  modificarTurno(turno:Turno){

    const documento = doc(this.colleccionTurnos, turno.id);
    return updateDoc(documento, {
      ...turno
    });
  }


  cantidadDeTurnosPorDia(horaInicio:number, horaFinal:number, duracion:number) {
    const diferenciaHorario = horaFinal - horaInicio;
    const turnosHora = 60 / duracion;

    return turnosHora * diferenciaHorario;
  }

  turnos30minutos(horaInicio:number, horaFinal:number, duracion:number) : Array<Turno>{
    const turnos = [];

    let cantidad = this.cantidadDeTurnosPorDia(horaInicio, horaFinal, duracion);
    let swap = false;
    horaFinal = horaInicio;

    for(let i = 0; i < cantidad; i++) {

      swap = !swap;
      if ( i > 0 ) {
        if ( i % 2 == 0 ) {
          horaInicio++;
        } else {
          horaFinal++;
        }
      }

      const turno = new Turno();

      turno.horaInicio = `${horaInicio}:${swap?'00':'30'}`;
      turno.horaFinal = `${horaFinal}:${!swap?'00':'30'}`;
      turno.duracion = duracion as duracion;

      turnos.push(turno);
    }
    return turnos;
  }

  turnos60minutos(horaInicio:number, horaFinal:number, duracion:number) : Array<Turno>{
    const turnos = [];

    let cantidad = this.cantidadDeTurnosPorDia(horaInicio, horaFinal, duracion);

    for(let i = 0; i < cantidad; i++) {

      const turno = new Turno();
      turno.horaInicio = `${horaInicio}:00`;
      turno.horaFinal = `${horaInicio+1}:00`;
      turno.duracion = duracion as duracion;

      turnos.push(turno);
      horaInicio++;
    }

    return turnos;
  }

  obtenerProximosDias(diaSemana: EDia = new Date().getDate(), cantidadDeSemanas: number = SEMANAS) {

    if(cantidadDeSemanas<1){
      cantidadDeSemanas = 1;
    }

    const fechas = [];
    const fechaActual = new Date();
    const diaSemanaActual = fechaActual.getDay();
    let diferenciaDias = diaSemana - diaSemanaActual;

    if (diferenciaDias < 0) {
      diferenciaDias += 7;
    }

    const primerFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diferenciaDias);

    for (let i = 0; i < cantidadDeSemanas; i++) {
      const fecha = new Date(primerFecha.getFullYear(), primerFecha.getMonth(), primerFecha.getDate() + (7 * i));
      fechas.push(fecha);
    }

    return fechas;
  }

  turnosParseados(turnos: Array<Turno>, diaSemana: EDia = new Date().getDate(), cantidadDeSemanas: number = SEMANAS) : Array<Turno> {
    const proximosDias = this.obtenerProximosDias(diaSemana, cantidadDeSemanas);

    return proximosDias.map(fecha=>{
      return turnos.map(turno=>{

        const fi = new Date(fecha);
        const xi = turno.horaInicio.split(":");
        fi.setHours(parseInt(xi[0]));
        fi.setMinutes(parseInt(xi[1]));

        const ff = new Date(fecha)
        const xf = turno.horaFinal.split(":");
        ff.setHours(parseInt(xf[0]));
        ff.setMinutes(parseInt(xf[1]));

        const _turno = JSON.parse(JSON.stringify(turno)) as Turno;

        _turno.idEspecialista = this.usuarioLogeado.id;
        _turno.fechaInicio = fi.getTime();
        _turno.fechaFinal = ff.getTime();

        return _turno;
      });
    }) as any;
  }

  traerTurnoCompleto(){
    this.getTurnosParaElAdministrador()
      .pipe(take(1))
      .subscribe((_turnos) => {
        const turnos = _turnos as Array<Turno>;
        if(turnos){
          this.usuarios.getUsuariosFiltrado('rol','especialista')
            .pipe(take(1))
            .subscribe((_especialistas)=>{
              const especialistas = _especialistas as Array<Especialista>;
              if(especialistas){
                this.usuarios.getUsuariosFiltrado('rol','paciente')
                  .pipe(take(1))
                  .subscribe((_pacientes)=>{
                    const pacientes = _pacientes as Array<Paciente>;
                    if(pacientes){
                      const turnosCompleto = turnos?.map((turno)=>{
                        const especialista = especialistas[especialistas.findIndex(e=>e.id == turno.idEspecialista)] as Especialista;
                        const paciente = pacientes[pacientes.findIndex(p=>p.id == turno.idPaciente)] as Paciente;
                        const turnoPacienteEspecialista = new TurnoCompleto()
                        turnoPacienteEspecialista.turno = turno
                        turnoPacienteEspecialista.especialista = especialista;
                        turnoPacienteEspecialista.paciente = paciente;
                        return turnoPacienteEspecialista;
                      });
                      this.turnosCompleto.next(turnosCompleto);
                    }else{
                      this.turnosCompleto.next([]);
                    }
                  })
              }else{
                this.turnosCompleto.next([]);
              }
            });
        }else{
          this.turnosCompleto.next([]);
        }
      })
  }

  getTurnosParaElAdministrador(){
    const estadoTurno : estadoTurno = "Libre";
    const q = query(this.colleccionTurnos,
      where('estadoTurno', '!=', estadoTurno),
      );
    return collectionData(q, { idField: 'id' });
  }

}
