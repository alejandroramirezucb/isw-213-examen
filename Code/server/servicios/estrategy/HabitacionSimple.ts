import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { EstrategiaHabitacion } from './EstrategiaHabitacion';

export class HabitacionSimple implements EstrategiaHabitacion {
  crear(): CrearTipoHabitacionDTO {
    return { nombre: 'Simple', capacidad_maxima: 1, precio_referencia: 80 };
  }
}
