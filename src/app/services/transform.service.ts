import { Injectable } from '@angular/core';
import { Dia } from '../models/types/dia.type';
import { Duracion } from '../models/types/duracion.type';

@Injectable({
  providedIn: 'root'
})
export class TransformService {

  private dias : Array<Dia | "Domingo"> = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  fechaToString(fecha: any, aaaaMMdd: boolean = false, hms: boolean = false) {
    if (fecha) {
      let dia = fecha.getDate();
      let mes = fecha.getMonth() + 1;
      let anio = fecha.getFullYear();

      let cadenaDia = dia < 10 ? '0' + dia.toString() : dia.toString();
      let cadenaMes = mes < 10 ? '0' + mes.toString() : mes.toString();

      if (hms) {
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();
        let segundos = fecha.getSeconds();
        let miliSegundos = fecha.getMilliseconds();

        let cadenaHoras = hora < 10 ? '0' + hora.toString() : hora.toString();
        let cadenaMinutos = minutos < 10 ? '0' + minutos.toString() : minutos.toString();
        let cadenaSegundos = segundos < 10 ? '0' + segundos.toString() : segundos.toString();

        if (aaaaMMdd)
          return anio.toString() + '-' + cadenaMes + '-' + cadenaDia + ' ' + cadenaHoras + ':' + cadenaMinutos + ':' + cadenaSegundos + ':' + miliSegundos;
        return cadenaDia + '-' + cadenaMes + '-' + anio.toString() + ' ' + cadenaHoras + ':' + cadenaMinutos + ':' + cadenaSegundos + ':' + miliSegundos;
      }
      if (aaaaMMdd)
        return anio.toString() + '-' + cadenaMes + '-' + cadenaDia;
      return cadenaDia + '-' + cadenaMes + '-' + anio.toString();
    }
    return '';
  }

}
