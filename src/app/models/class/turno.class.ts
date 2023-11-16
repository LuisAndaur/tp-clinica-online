import { duracion } from "../types/duracion.type";
import { estadoTurno } from "../types/estado-turno.type";
import { Especialidad } from "./especialidad.class";

export class Turno {
  id?: string;
  horaInicio!: string;
  horaFinal!: string;
  duracion!: duracion;
  fechaInicio!: number;
  fechaFinal!: number;
  estadoTurno: estadoTurno = "Libre";
  idPaciente: string = "";
  idEspecialista!: string;
  especialidad!: Especialidad;
  comentarioPaciente: string = "";
  comentarioEspecialista: string = "";
  reseniaEspecialista: string = "";
  encuestaPaciente: string = "";
  calificacionPaciente: string = "";
  diagnosticoEspecialista: string = "";
  comentarioAdministrador: string = "";
}
