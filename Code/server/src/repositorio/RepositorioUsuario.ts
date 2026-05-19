import { AppDataSource } from '../config/BaseDatos';
import { Usuario, RolUsuario } from '../modelos/Usuario';

export const RepositorioUsuario = AppDataSource.getRepository(Usuario).extend({
  buscarPorCorreo(correo_auth: string) {
    return this.findOneBy({ correo_auth });
  },

  buscarActivos() {
    return this.findBy({ activo: true });
  },

  buscarPorRol(rol: RolUsuario) {
    return this.findBy({ rol, activo: true });
  },

  buscarConHuesped(id: number) {
    return this.findOne({
      where: { id },
      relations: { huesped: true },
    });
  },
});
