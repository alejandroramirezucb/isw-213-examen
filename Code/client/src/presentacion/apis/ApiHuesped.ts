import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type Huesped = {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo_reserva: string;
  telefono: string | null;
};

type CrearHuesped = {
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
};

type ActualizarHuesped = {
  nombres?: string;
  apellidos?: string;
  correo_reserva?: string;
  telefono?: string;
};

const ApiHuesped = {
  listar: (): Promise<Result<Huesped[], string>> =>
    ClienteApp.peticion('/huesped'),

  buscarPorId: (id: number): Promise<Result<Huesped, string>> =>
    ClienteApp.peticion(`/huesped/${id}`),

  buscarPorDocumento: (
    tipo: string,
    numero: string,
  ): Promise<Result<Huesped, string>> =>
    ClienteApp.peticion(
      `/huesped/buscar/documento?tipo=${tipo}&numero=${numero}`,
    ),

  buscarPorNombres: (termino: string): Promise<Result<Huesped[], string>> =>
    ClienteApp.peticion(
      `/huesped/buscar/nombres?termino=${encodeURIComponent(termino)}`,
    ),

  registrar: (dto: CrearHuesped): Promise<Result<Huesped, string>> =>
    ClienteApp.peticion('/huesped', 'POST', dto),

  actualizar: (
    id: number,
    dto: ActualizarHuesped,
  ): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/huesped/${id}`, 'PUT', dto),
};

export default ApiHuesped;
