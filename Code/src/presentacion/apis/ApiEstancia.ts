import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type Estancia = {
  id: number;
  timestamp_checkin: string;
  registrado_checkin_por: string | null;
  observaciones_checkin: string | null;
  timestamp_checkout: string | null;
  es_late_checkout: boolean | null;
  monto_cargo_extra: number;
  registrado_checkout_por: string | null;
  observaciones_checkout: string | null;
};

type CheckinDto = {
  registrado_por?: string;
  observaciones?: string;
};

type CheckoutDto = {
  registrado_por?: string;
  observaciones?: string;
};

const ApiEstancia = {
  listarAbiertas: (): Promise<Result<Estancia[], string>> =>
    ClienteApp.peticion('/estancia/abiertas'),

  buscarPorReserva: (idReserva: number): Promise<Result<Estancia, string>> =>
    ClienteApp.peticion(`/estancia/reserva/${idReserva}`),

  registrarCheckin: (
    idReserva: number,
    dto: CheckinDto,
  ): Promise<Result<Estancia, string>> =>
    ClienteApp.peticion(`/estancia/reserva/${idReserva}/checkin`, 'POST', dto),

  registrarCheckout: (
    idReserva: number,
    dto: CheckoutDto,
  ): Promise<Result<Estancia, string>> =>
    ClienteApp.peticion(`/estancia/reserva/${idReserva}/checkout`, 'PUT', dto),
};

export default ApiEstancia;
