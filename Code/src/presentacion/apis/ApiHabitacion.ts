import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type Habitacion = {
  id: number;
  numero_habitacion: string;
  piso: number;
  estado: string;
  tipo_habitacion?: {
    id: number;
    nombre: string;
    capacidad_maxima: number;
    precio_referencia: number;
  };
};

const ApiHabitacion = {
  listar: (): Promise<Result<Habitacion[], string>> =>
    ClienteApp.peticion('/habitacion'),

  listarDisponibles: (): Promise<Result<Habitacion[], string>> =>
    ClienteApp.peticion('/habitacion/disponibles'),

  listarPorPiso: (piso: number): Promise<Result<Habitacion[], string>> =>
    ClienteApp.peticion(`/habitacion/piso/${piso}`),

  buscarPorId: (id: number): Promise<Result<Habitacion, string>> =>
    ClienteApp.peticion(`/habitacion/${id}`),

  cambiarEstado: (id: number, estado: string): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/habitacion/${id}/estado`, 'PUT', { estado }),
};

export default ApiHabitacion;
