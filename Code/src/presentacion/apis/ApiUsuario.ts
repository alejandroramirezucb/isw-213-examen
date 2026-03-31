import { Result } from 'ts-results';
import { ClienteApp } from '../../config/ClienteApp';

type Usuario = {
  id: number;
  correo_auth: string;
  rol: string;
  activo: boolean;
};

type AutenticarDto = {
  correo: string;
  password: string;
};

type CrearUsuario = {
  correo: string;
  password: string;
  rol: string;
  id_huesped?: number;
};

const ApiUsuario = {
  autenticar: (dto: AutenticarDto): Promise<Result<Usuario, string>> =>
    ClienteApp.peticion('/usuario/autenticar', 'POST', dto),

  crear: (dto: CrearUsuario): Promise<Result<Usuario, string>> =>
    ClienteApp.peticion('/usuario', 'POST', dto),

  buscarPorId: (id: number): Promise<Result<Usuario, string>> =>
    ClienteApp.peticion(`/usuario/${id}`),

  desactivar: (id: number): Promise<Result<void, string>> =>
    ClienteApp.peticion(`/usuario/${id}`, 'DELETE'),
};

export default ApiUsuario;
