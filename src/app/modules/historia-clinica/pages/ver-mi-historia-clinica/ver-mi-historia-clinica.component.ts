import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Paciente } from 'src/app/models/class/paciente.class';
import { TurnoPaciente } from 'src/app/models/class/turno-paciente.class';
import { COLECCION } from 'src/app/models/constants/coleccion.constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-ver-mi-historia-clinica',
  templateUrl: './ver-mi-historia-clinica.component.html',
  styleUrls: ['./ver-mi-historia-clinica.component.scss']
})
export class VerMiHistoriaClinicaComponent implements OnInit {

  @Input() sePuedeDescargarPDF: boolean = false;
  @Input() posicionDeHistoria: number = -1;
  @Input() turnosDePaciente: Array<TurnoPaciente> = [];
  @Output() ocultar = new EventEmitter<null>();
  usuarioLogeado!: Paciente;
  filtro:string ="";

  constructor(
    private localStorage: LocalStorageService,
    private pdfService: PdfService
  ){}

  ngOnInit(): void {
    this.usuarioLogeado = this.localStorage.obtenerItem(COLECCION.LOGEADO);
  }

  ocultarHistorias(){
    this.ocultar.emit(null);
  }

  descargarPDF(): void {
    if(this.turnosDePaciente != undefined){
    this.pdfService.CrearPDFHistoriaClinica(this.usuarioLogeado, this.turnosDePaciente);

    }
  }
}
