import { Pipe, PipeTransform } from '@angular/core';
import { TransformService } from '../../services/transform.service';
import { TurnoCompleto } from '../../models/class/turno-completo.class';

@Pipe({
  name: 'filtroTurnosAdmin'
})
export class FiltroTurnosAdminPipe implements PipeTransform {

  constructor(private transformService: TransformService){}

  transform(turnosCompletos: Array<TurnoCompleto>, filtro: string): Array<TurnoCompleto> {
    if (!turnosCompletos || !filtro) {
      return turnosCompletos!;
    }

    return turnosCompletos?.filter(turnoCompleto => {
      return turnoCompleto?.especialista?.nombre?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoCompleto?.especialista?.apellido?.toUpperCase().includes(filtro?.toUpperCase())
          || turnoCompleto?.paciente?.apellido?.toUpperCase().includes(filtro?.toUpperCase())
          || this.transformService.fechaCompleta(turnoCompleto?.turno?.fechaInicio).includes(filtro?.toUpperCase())
          || turnoCompleto?.turno?.horaInicio?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoCompleto?.turno?.horaFinal?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoCompleto?.turno?.duracion?.toString()?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoCompleto?.turno?.estadoTurno?.toLowerCase()?.includes(filtro?.toLowerCase())
          || turnoCompleto?.turno?.especialidad?.especialidad?.toUpperCase()?.includes(filtro?.toUpperCase())
          // || turnoCompleto?.turno?.comentarioPaciente?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.comentarioEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.reseniaEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.encuestaPaciente?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.calificacionPaciente?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.diagnosticoEspecialista?.toLowerCase()?.includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.comentarioAdministrador?.toLowerCase()?.includes(filtro?.toLowerCase())

          // || turnoCompleto?.turno?.historiaClinica?.altura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.peso?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.presion?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.temperatura?.toString()?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d1?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d1?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d2?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d2?.valor?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d3?.clave?.toLowerCase().includes(filtro?.toLowerCase())
          // || turnoCompleto?.turno?.historiaClinica?.datosDinamicos?.d3?.valor?.toLowerCase().includes(filtro?.toLowerCase())
        });
  }

}
