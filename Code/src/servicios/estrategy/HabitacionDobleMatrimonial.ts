import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { EstrategiaHabitacion } from './EstrategiaHabitacion';

export class HabitacionDobleMatrimonial implements EstrategiaHabitacion {
  crear(): CrearTipoHabitacionDTO {
    return { nombre: 'Doble Matrimonial', capacidad_maxima: 2, precio_referencia: 150 };
  }
}
