import { AppDataSource } from '../data-source';
import { TiposHabitacion } from '../modelos/TiposHabitacion';

export const RepositorioTipoHabitacion = AppDataSource.getRepository(
  TiposHabitacion,
).extend({
  findByNombre(nombre: string) {
    return this.findOneBy({ nombre });
  },

  findConHabitaciones() {
    return this.find({
      relations: { habitaciones: true },
      order: { nombre: 'ASC' },
    });
  },
});
