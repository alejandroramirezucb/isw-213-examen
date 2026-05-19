import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { EstrategiaHabitacion } from './EstrategiaHabitacion';

export class HabitacionSuite implements EstrategiaHabitacion {
  crear(): CrearTipoHabitacionDTO {
    return { nombre: 'Suite', capacidad_maxima: 2, precio_referencia: 200 };
  }
}
