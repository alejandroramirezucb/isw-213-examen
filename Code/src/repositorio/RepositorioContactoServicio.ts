import { AppDataSource } from '../data-source';
import { ContactoServicio } from '../modelos/ContactoServicio';

export const RepositorioContactoServicio = AppDataSource.getRepository(
  ContactoServicio,
).extend({
  findActivos() {
    return this.findBy({ activo: true });
  },

  findByNombre(nombre: string) {
    return this.findOneBy({ nombre_servicio: nombre });
  },
});
