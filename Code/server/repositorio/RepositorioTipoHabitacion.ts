import { AppDataSource } from '../config/BaseDatos';
import { TiposHabitacion } from '../modelos/TiposHabitacion';

export const RepositorioTipoHabitacion = AppDataSource.getRepository(
  TiposHabitacion,
).extend({
  buscarTodas() {
    return this.find({ order: { nombre: 'ASC' } });
  },

  buscarPorNombre(nombre: string) {
    return this.findOneBy({ nombre });
  },

  buscarConHabitaciones() {
    return this.find({
      relations: { habitaciones: true },
      order: { nombre: 'ASC' },
    });
  },
});
