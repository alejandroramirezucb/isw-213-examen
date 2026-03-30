import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { EstrategiaHabitacion } from './EstrategiaHabitacion';

export class HabitacionDobleIndividual implements EstrategiaHabitacion {
  crear(): CrearTipoHabitacionDTO {
    return { nombre: 'Doble Individual', capacidad_maxima: 2, precio_referencia: 120 };
  }
}
