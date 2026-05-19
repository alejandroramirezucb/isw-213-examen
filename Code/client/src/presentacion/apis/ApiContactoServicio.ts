import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type ContactoServicio = {
  id: number;
  nombre_servicio: string;
  persona_contacto: string | null;
  telefono: string | null;
  correo: string | null;
  descripcion: string | null;
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
