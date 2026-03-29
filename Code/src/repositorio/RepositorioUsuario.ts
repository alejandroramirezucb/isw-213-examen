import { AppDataSource } from '../data-source';
import { Usuario, RolUsuario } from '../modelos/Usuario';

export const RepositorioUsuario = AppDataSource.getRepository(Usuario).extend({
  findByCorreo(correo_auth: string) {
    return this.findOneBy({ correo_auth });
  },

  findActivos() {
    return this.findBy({ activo: true });
  },

  findByRol(rol: RolUsuario) {
    return this.findBy({ rol, activo: true });
  },

  findConHuesped(id: number) {
    return this.findOne({
      where: { id },
      relations: { huesped: true },
    });
  },
});
