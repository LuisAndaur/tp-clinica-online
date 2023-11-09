import { EDia } from "../enums/dia.enum";
import { Dia } from "../types/dia.type";
import { Duracion } from "../types/duracion.type";
import { HorarioSemanaFinal } from "../types/horario-semana-final.type";
import { HorarioSemanaInicio } from "../types/horario-semana-inicio.type";
import { Especialidad } from "./especialidad.class";

export class Horarios {
  dia!: Dia;
  diaNumero!: EDia;
  duracion!: Duracion;
  horaInicio!: HorarioSemanaInicio;
  horaFinal!: HorarioSemanaFinal;
  especialidad!: Especialidad;
  id?: string;
}
