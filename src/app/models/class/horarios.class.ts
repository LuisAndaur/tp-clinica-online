import { EDia } from "../enums/dia.enum";
import { dia } from "../types/dia.type";
import { duracion } from "../types/duracion.type";
import { horarioSemanaFinal } from "../types/horario-semana-final.type";
import { horarioSemanaInicio } from "../types/horario-semana-inicio.type";
import { Especialidad } from "./especialidad.class";

export class Horarios {
  dia!: dia;
  diaNumero!: EDia;
  duracion!: duracion;
  horaInicio!: horarioSemanaInicio;
  horaFinal!: horarioSemanaFinal;
  especialidad!: Especialidad;
  id?: string;
}
