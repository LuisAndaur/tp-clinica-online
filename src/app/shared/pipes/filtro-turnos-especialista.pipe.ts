import { Pipe, PipeTransform } from '@angular/core';
import { TurnoEspecialista } from 'src/app/models/class/turno-especialista.class';
import { TransformService } from 'src/app/services/transform.service';

@Pipe({
  name: 'filtroTurnosEspecialista'
})
export class FiltroTurnosEspecialistaPipe implements PipeTransform {

  constructor(private transformService: TransformService){}

  transform(turnosEspecialista: Array<TurnoEspecialista>, filtro: string): Array<TurnoEspecialista> {

    if (!turnosEspecialista || !filtro) {
      return turnosEspecialista!;
    }
    return turnosEspecialista?.filter(turnoEspecialista => {
      return turnoEspecialista?.paciente?.apellido?.toUpperCase().includes(filtro?.toUpperCase())
          || this.transformService.fechaCompleta(turnoEspecialista?.turno?.fechaInicio).includes(filtro?.toUpperCase())
          || turnoEspecialista?.turno?.horaInicio?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.horaFinal?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.duracion?.toString()?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.estadoTurno?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.especialidad?.especialidad?.toUpperCase()?.includes(filtro?.toUpperCase())
          || turnoEspecialista?.turno?.especialidad?.especialidad?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.comentarioPaciente?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.comentarioEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.reseniaEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.diagnosticoEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.comentarioAdministrador?.toLowerCase()?.includes(filtro?.toLowerCase())

          || turnoEspecialista?.turno?.historiaClinica?.altura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.peso?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.presion?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.temperatura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d1?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d1?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d2?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d2?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d3?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          || turnoEspecialista?.turno?.historiaClinica?.datosDinamicos?.d3?.valor?.toLowerCase().includes(filtro?.toLowerCase())
        });
  }

}
