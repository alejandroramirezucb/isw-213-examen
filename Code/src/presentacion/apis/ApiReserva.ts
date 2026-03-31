import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type Reserva = {
  id: number;
  fecha_checkin: string;
  fecha_checkout: string;
  cantidad_personas: number;
  estado: string;
  notas: string | null;
  habitacion?: { id: number; numero_habitacion: string };
};

type HuespedReserva = {
  id_reserva: number;
  id_huesped: number;
  es_titular: boolean;
  huesped?: { id: number; nombres: string; apellidos: string };
};

type CrearReserva = {
  id_habitacion: number;
  id_huesped_titular: number;
  fecha_checkin: string;
  fecha_checkout: string;
  cantidad_personas: number;
  notas?: string;
};

type CancelarReserva = {
  motivo?: string;
  registrado_por?: string;
};

const ApiReserva = {
  listarActivas: (): Promise<Result<Reserva[], string>> =>
    ClienteApp.peticion('/reserva/activas'),

  buscarPorId: (id: number): Promise<Result<Reserva, string>> =>
    ClienteApp.peticion(`/reserva/${id}`),

  crear: (dto: CrearReserva): Promise<Result<Reserva, string>> =>
    ClienteApp.peticion('/reserva', 'POST', dto),

  cancelar: (id: number, dto: CancelarReserva): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/reserva/${id}/cancelar`, 'PUT', dto),

  listarHuespedes: (
    idReserva: number,
  ): Promise<Result<HuespedReserva[], string>> =>
    ClienteApp.peticion(`/reserva/${idReserva}/huespedes`),

  agregarHuesped: (
    idReserva: number,
    idHuesped: number,
  ): Promise<Result<HuespedReserva, string>> =>
    ClienteApp.peticion(`/reserva/${idReserva}/huespedes`, 'POST', {
      idHuesped,
    }),

  quitarHuesped: (
    idReserva: number,
    idHuesped: number,
  ): Promise<Result<void, string>> =>
    ClienteApp.peticion(
      `/reserva/${idReserva}/huespedes/${idHuesped}`,
      'DELETE',
    ),

  cambiarTitular: (
    idReserva: number,
    idHuespedNuevo: number,
  ): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/reserva/${idReserva}/huespedes/titular`, 'PUT', {
      idHuespedNuevo,
    }),
};

export default ApiReserva;
