import { AppDataSource } from '../config/BaseDatos';
import { TiposHabitacion } from '../modelos/TiposHabitacion';

export const RepositorioTipoHabitacion = AppDataSource.getRepository(
  TiposHabitacion,
).extend({
  findTodas() {
    return this.find({ order: { nombre: 'ASC' } });
  },

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
