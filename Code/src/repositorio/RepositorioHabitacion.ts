import { AppDataSource } from '../data-source';
import { Habitacion, EstadoHabitacion } from '../modelos/Habitacion';

export const RepositorioHabitacion = AppDataSource.getRepository(
  Habitacion,
).extend({
  findDisponibles() {
    return this.find({
      relations: { tipo_habitacion: true },
      where: { estado: EstadoHabitacion.DISPONIBLE },
      order: { numero_habitacion: 'ASC' },
    });
  },

  findByPiso(piso: number) {
    return this.find({
      relations: { tipo_habitacion: true },
      where: { piso },
      order: { numero_habitacion: 'ASC' },
    });
  },

  findByEstado(estado: EstadoHabitacion) {
    return this.findBy({ estado });
  },
});
