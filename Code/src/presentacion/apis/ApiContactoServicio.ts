import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type ContactoServicio = {
  id: number;
  nombre: string;
  encargado: string;
  telefono: string;
  activo: boolean;
};

const ApiContactoServicio = {
  listarActivos: (): Promise<Result<ContactoServicio[], string>> =>
    ClienteApp.peticion('/contacto-servicio/activos'),

  buscarPorNombre: (
    nombre: string,
  ): Promise<Result<ContactoServicio[], string>> =>
    ClienteApp.peticion(
      `/contacto-servicio?nombre=${encodeURIComponent(nombre)}`,
    ),
};

export default ApiContactoServicio;
