import { AppDataSource } from '../config/BaseDatos';
import { ContactoServicio } from '../modelos/ContactoServicio';

export const RepositorioContactoServicio = AppDataSource.getRepository(
  ContactoServicio,
).extend({
  buscarActivos() {
    return this.findBy({ activo: true });
  },

  buscarPorNombre(nombre: string) {
    return this.findOneBy({ nombre_servicio: nombre });
  },
});
