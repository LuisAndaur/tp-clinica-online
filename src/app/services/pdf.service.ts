import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import { Paciente } from '../models/class/paciente.class';
import { TransformService } from './transform.service';
import { TurnoPaciente } from '../models/class/turno-paciente.class';
import { Turno } from '../models/class/turno.class';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  public doc = new jsPDF();
  constructor(private transform: TransformService) { }

  public CrearPDFHistoriaClinica(paciente: Paciente, turnosPaciente: TurnoPaciente[])
  {
    let num = 45;
    let fecha = this.transform.fechaCompleta(new Date().getTime());

    this.doc.addImage("./../../assets/logo.png", 'png', 175, 10, 25, 25);
    this.doc.setFont('helvetica');
    this.doc.setFontSize(12);
    this.doc.text("TP - CLINICA ONLINE", 10, 20);
    this.doc.text("Historia clinica de " + paciente.nombre + ' ' + paciente.apellido, 10, 30);

    for(let i = 0; i < turnosPaciente.length; i++ ){
      this.doc.text("|-------------------- Fecha turno:  " + this.transform.fechaCompleta(turnosPaciente[i].turno.fechaInicio) + "  --------------------|", 10, 50+(i*num));

      this.doc.text("Altura: " + turnosPaciente[i].turno.historiaClinica?.altura , 10, 57+(i*num));
      this.doc.text("temperatura: " + turnosPaciente[i].turno.historiaClinica?.temperatura, 10, 64+(i*num));
      this.doc.text("Presion: " + turnosPaciente[i].turno.historiaClinica?.presion, 10, 71+(i*num));
      this.doc.text("Datos Extras: " , 10, 78+(i*num));
      this.doc.text(turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d1.clave + " : " + turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d1.valor, 40, 78+(i*num));
      this.doc.text(turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d2.clave + " : " + turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d2.valor, 90, 78+(i*num));
      this.doc.text(turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d3.clave + " : " + turnosPaciente[i].turno.historiaClinica?.datosDinamicos.d3.valor, 140, 78+(i*num));
    }


    this.doc.text("Fecha de emisión:  " + fecha, 10, 280);
    this.doc.save("historia" + paciente.nombre + paciente.apellido + ".pdf");
  }
}
