import { Especialista } from "./especialista.class";
import { Paciente } from "./paciente.class";
import { Turno } from "./turno.class";

export class TurnoCompleto {
  turno!: Turno;
  especialista!: Especialista;
  paciente!: Paciente;
}
