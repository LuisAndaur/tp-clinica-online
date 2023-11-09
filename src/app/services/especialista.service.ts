import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { COLECCION } from '../models/constants/coleccion.constant';
import { Observable } from 'rxjs';
import { Horarios } from '../models/class/horarios.class';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  private collecionEspecialidades: any;

  constructor(private firestore: Firestore,) {
    this.collecionEspecialidades = collection(this.firestore,COLECCION.ESPECIALIDADES);
   }

  getEspecialidades(): Observable<Array<string> | any> {
    const collecionEspecialidades = collection(this.firestore,COLECCION.ESPECIALIDADES);
    const q = query(collecionEspecialidades, orderBy('especialidad', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }

  setEspecialidades(especialidad: string) {
    return addDoc(this.collecionEspecialidades, {especialidad});
  }

  // Función para validar el ingreso de un turno
  validarTurno(dia:number, horaInicio:number, horaFinal:number, horarios:Array<Horarios>) {
    // Verificar si el turno se superpone con alguno de los turnos existentes
    for (let turno of horarios) {
      // Verificar si es el mismo día y hay superposición de horarios
      if (turno.diaNumero === dia) {
        // Verificar si hay superposición de horarios
        if (
          (horaInicio >= turno.horaInicio && horaInicio < turno.horaFinal) ||
          (horaFinal > turno.horaInicio && horaFinal <= turno.horaFinal) ||
          (horaInicio <= turno.horaInicio && horaFinal >= turno.horaFinal)
        ) {
          return false; // Hay superposición de horarios, el turno no es válido
        }
      }
    }
    return true; // El turno es válido y se ha agregado correctamente
  }

  ordenarHorarios(a: Horarios, b: Horarios) {
    if (a.diaNumero < b.diaNumero) {
      return -1;
    } else if (a.diaNumero > b.diaNumero) {
      return 1;
    } else {
      if (a.horaInicio < b.horaInicio) {
        return -1;
      } else if (a.horaInicio > b.horaInicio) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  validarHorarios(horarios: Horarios): [boolean, string] {
    let mensaje = "";

    // console.log(horarios.horaInicio>horarios.horaFinal, horarios.horaInicio,horarios.horaFinal);
    if(horarios.horaInicio > horarios.horaFinal){
      // this.toast.error("La hora inicio no puede ser más grande que la hora final")
      console.log("error");
      mensaje = "La hora inicio no puede ser más grande que la hora final";
    }else if(horarios.horaInicio == horarios.horaFinal){
      // this.toast.error("La hora final no puede ser igual que la hora inicio")
      mensaje = "La hora final no puede ser igual que la hora inicio";
    }else{
      const diferenciaHorario = horarios.horaFinal - horarios.horaInicio;
      const minutosTurnos = diferenciaHorario * 60;
      if(horarios.duracion > minutosTurnos){
        // this.toast.error("No se puede, ya que la diferencia de tiempo entre tiempo final e inicial es mayor que la duración de 1 solo turno")
        mensaje = "No se puede, ya que la diferencia de tiempo entre tiempo final e inicial es mayor que la duración de 1 solo turno";
      }else{
        return [true, ""];
      }
      // console.log(horarios.duracion,minutosTurnos)
      // console.log(diferenciaHorario,minutosTurnos);
    }
    return [false, mensaje];
  }
}
