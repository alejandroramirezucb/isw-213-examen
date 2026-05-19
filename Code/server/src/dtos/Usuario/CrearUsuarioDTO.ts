import { RolUsuario } from '../../modelos/Usuario';

export interface CrearUsuarioDTO {
  correo: string;
  password: string;
  rol: RolUsuario;
  id_huesped?: number;
}
