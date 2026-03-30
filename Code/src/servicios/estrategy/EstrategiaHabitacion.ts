import { CrearTipoHabitacionDTO } from '../../dtos/TiposHabitacion/CrearTipoHabitacionDTO';

export interface EstrategiaHabitacion {
  crear(): CrearTipoHabitacionDTO;
}
