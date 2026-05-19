import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type TipoHabitacion = {
  id: number;
  nombre: string;
  descripcion: string | null;
  capacidad_maxima: number;
  precio_referencia: number;
};

type CrearTipoHabitacion = {
  nombre: string;
  descripcion?: string;
  capacidad_maxima?: number;
  precio_referencia?: number;
};

type ActualizarTipoHabitacion = {
  nombre?: string;
  descripcion?: string;
  capacidad_maxima?: number;
  precio_referencia?: number;
};

const ApiTipoHabitacion = {
  listar: (): Promise<Result<TipoHabitacion[], string>> =>
    ClienteApp.peticion('/tipo-habitacion'),

  buscarPorId: (id: number): Promise<Result<TipoHabitacion, string>> =>
    ClienteApp.peticion(`/tipo-habitacion/${id}`),

  crear: (dto: CrearTipoHabitacion): Promise<Result<TipoHabitacion, string>> =>
    ClienteApp.peticion('/tipo-habitacion', 'POST', dto),

  actualizar: (
    id: number,
    dto: ActualizarTipoHabitacion,
  ): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/tipo-habitacion/${id}`, 'PUT', dto),
};

export default ApiTipoHabitacion;
