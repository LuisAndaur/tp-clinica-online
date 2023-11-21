import { DatosDinamicos } from "./datos-dinamicos.class";

export class HistoriaClinica {
  altura!: number;
  peso!: number;
  temperatura!: number;
  presion!: number;
  datosDinamicos: DatosDinamicos = new DatosDinamicos();
}
