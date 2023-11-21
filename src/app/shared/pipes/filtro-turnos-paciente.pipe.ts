import { Pipe, PipeTransform } from '@angular/core';
import { TurnoPaciente } from 'src/app/models/class/turno-paciente.class';
import { TransformService } from 'src/app/services/transform.service';

@Pipe({
  name: 'filtroTurnosPaciente'
})
export class FiltroTurnosPacientePipe implements PipeTransform {

  constructor(private transformService: TransformService){}

  transform(turnosPaciente: Array<TurnoPaciente>, filtro: string): Array<TurnoPaciente> {
    if (!turnosPaciente || !filtro) {
      return turnosPaciente!;
    }
    return turnosPaciente?.filter(turnoPaciente => {
      return turnoPaciente?.especialista?.apellido?.toUpperCase().includes(filtro?.toUpperCase())
          || this.transformService.fechaCompleta(turnoPaciente?.turno?.fechaInicio).includes(filtro?.toUpperCase())
          || turnoPaciente?.turno?.horaInicio?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.horaFinal?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.duracion?.toString()?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.estadoTurno?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.especialidad?.especialidad?.toUpperCase()?.includes(filtro?.toUpperCase())
          || turnoPaciente?.turno?.especialidad?.especialidad?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.comentarioPaciente?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.comentarioEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.reseniaEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.diagnosticoEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.comentarioAdministrador?.toLowerCase()?.includes(filtro?.toLowerCase())

          || turnoPaciente?.turno?.historiaClinica?.altura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.peso?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.presion?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.temperatura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d1?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d1?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d2?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d2?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d3?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoPaciente?.turno?.historiaClinica?.datosDinamicos?.d3?.valor?.toLowerCase().includes(filtro?.toLowerCase())
        });
  }

}
