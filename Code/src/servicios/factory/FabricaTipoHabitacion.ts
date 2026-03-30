import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { EstrategiaHabitacion } from '../estrategy/EstrategiaHabitacion';
import { HabitacionSimple } from '../estrategy/HabitacionSimple';
import { HabitacionSuite } from '../estrategy/HabitacionSuite';
import { HabitacionDobleIndividual } from '../estrategy/HabitacionDobleIndividual';
import { HabitacionDobleMatrimonial } from '../estrategy/HabitacionDobleMatrimonial';

export class FabricaTipoHabitacion {
  private static readonly estrategias: Record<string, EstrategiaHabitacion> = {
    Simple: new HabitacionSimple(),
    Suite: new HabitacionSuite(),
    'Doble Individual': new HabitacionDobleIndividual(),
    'Doble Matrimonial': new HabitacionDobleMatrimonial(),
  };

  static crear(nombre: string): CrearTipoHabitacionDTO | null {
    const estrategia = FabricaTipoHabitacion.estrategias[nombre];

    if (!estrategia) {
      return null;
    }

    return estrategia.crear();
  }
}
