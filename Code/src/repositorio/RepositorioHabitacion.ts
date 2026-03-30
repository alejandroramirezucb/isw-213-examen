import { AppDataSource } from '../config/BaseDatos';
import { Habitacion, EstadoHabitacion } from '../modelos/Habitacion';

export const RepositorioHabitacion = AppDataSource.getRepository(
  Habitacion,
).extend({
  buscarTodas() {
    return this.find({
      relations: { tipo_habitacion: true },
      order: { numero_habitacion: 'ASC' },
    });
  },

  buscarConTipo(id: number) {
    return this.findOne({
      relations: { tipo_habitacion: true },
      where: { id },
    });
  },

  buscarDisponibles() {
    return this.find({
      relations: { tipo_habitacion: true },
      where: { estado: EstadoHabitacion.DISPONIBLE },
      order: { numero_habitacion: 'ASC' },
    });
  },

  buscarPorPiso(piso: number) {
    return this.find({
      relations: { tipo_habitacion: true },
      where: { piso },
      order: { numero_habitacion: 'ASC' },
    });
  },

  buscarPorEstado(estado: EstadoHabitacion) {
    return this.findBy({ estado });
  },
});
