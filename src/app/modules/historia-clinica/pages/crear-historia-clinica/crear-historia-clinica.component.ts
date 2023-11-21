import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HistoriaClinica } from 'src/app/models/class/historia-clinica.class';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-crear-historia-clinica',
  templateUrl: './crear-historia-clinica.component.html',
  styleUrls: ['./crear-historia-clinica.component.scss']
})
export class CrearHistoriaClinicaComponent implements OnInit {

  @Output() historiaClinica = new EventEmitter<HistoriaClinica>();
  @Output() canceloHistoriaClinica = new EventEmitter<boolean>();
  @Output() ocultar = new EventEmitter<null>();
  mostrar: null | boolean = true;

  form!: FormGroup;
  vAltura = { min: 10, max: 230 };
  vPeso = { min: 10, max: 150 };
  vTemperatura = { min: 33, max: 45 };
  vPresion = { min: 60, max: 130 };
  clave1: string = "";
  valor1: string = "";
  clave2: string = "";
  valor2: string = "";
  clave3: string = "";
  valor3: string = "";

  constructor(
    private swal: SwalService
  ){}

  ngOnInit(): void {
    this.iniciarForm();
  }

  private iniciarForm(): void{
    this.form = new FormGroup({
      altura: new FormControl("", {
        validators: [Validators.required, Validators.min(this.vAltura.min), Validators.max(this.vAltura.max)]
      }),

      peso: new FormControl("", {
        validators: [Validators.required, Validators.min(this.vPeso.min), Validators.max(this.vPeso.max)]
      }),

      temperatura: new FormControl("", {
        validators: [Validators.required, Validators.min(this.vTemperatura.min), Validators.max(this.vTemperatura.max)]
      }),

      presion: new FormControl("", {
        validators: [Validators.required, Validators.min(this.vPresion.min), Validators.max(this.vPresion.max)]
      }),
    });
  }


  get altura(){
    return this.form.get('altura');
  }

  get peso(){
    return this.form.get('peso');
  }

  get temperatura(){
    return this.form.get('temperatura');
  }

  get presion(){
    return this.form.get('presion');
  }

  getErrors(errores: any): Array<string> {
    return Object.keys(errores);
  }

  posiblementeBorroValor1(){
    if(this.clave1.trim() == ''){
      this.valor1 = "";
    }
  }
  posiblementeBorroValor2(){
    if(this.clave2.trim() == ''){
      this.valor2 = "";
    }
  }
  posiblementeBorroValor3(){
    if(this.clave3.trim() == ''){
      this.valor3 = "";
    }
  }

  private obtenerHistoriaClinica(): HistoriaClinica{
    const historiaClinica = new HistoriaClinica;
    historiaClinica.altura = this.altura?.value;
    historiaClinica.peso = this.peso?.value;
    historiaClinica.temperatura = this.temperatura?.value;
    historiaClinica.presion = this.presion?.value;
    if(this.valor1.trim() != ''){
      historiaClinica.datosDinamicos.d1.valor = this.valor1;
      historiaClinica.datosDinamicos.d1.clave = this.clave1;
    }
    if(this.valor2.trim() != ''){
      historiaClinica.datosDinamicos.d2.valor = this.valor2;
      historiaClinica.datosDinamicos.d2.clave = this.clave2;
    }
    if(this.valor3.trim() != ''){
      historiaClinica.datosDinamicos.d3.valor = this.valor3;
      historiaClinica.datosDinamicos.d3.clave = this.clave3;
    }

    return historiaClinica;
  }

  private verificarFormulario():boolean{
    return this.form.valid
        && this.validarValor1()
        && this.validarValor2()
        && this.validarValor3()
  }

  validarValor1():boolean{
    return this.clave1.trim() == "" || this.clave1.trim() != '' && this.valor1.trim() != ''
  }

  validarValor2():boolean{
    return this.clave2.trim() == "" || this.clave2.trim() != '' && this.valor2.trim() != ''
  }

  validarValor3():boolean{
    return this.clave3.trim() == "" || this.clave3.trim() != '' && this.valor3.trim() != ''
  }

  enviarForm(){
    if(this.verificarFormulario()){
      const historiaClinica = this.obtenerHistoriaClinica();
      this.historiaClinica.emit(historiaClinica);
      // console.log(historiaClinica);
      this.borrarForm();
      this.ocultar.emit(null);
    }else{
      this.swal.warning("El formulario no es valido aún. Verifique los campos");
    }
  }

  borrarForm(){
    this.clave1 = "";
    this.valor1 = "";
    this.clave2 = "";
    this.valor2 = "";
    this.clave3 = "";
    this.valor3 = "";
    this.form.reset();
  }

  cancelarForm(){
    this.canceloHistoriaClinica.emit(true);
  }

}
