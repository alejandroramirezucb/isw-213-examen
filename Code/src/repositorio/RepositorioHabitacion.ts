import { AppDataSource } from '../config/BaseDatos';
import { Habitacion, EstadoHabitacion } from '../modelos/Habitacion';
import { Reserva, EstadoReserva } from '../modelos/Reserva';
import { In, LessThan, MoreThan, Not } from 'typeorm';

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

  async buscarDisponiblesEnRango(fechaCheckin: string, fechaCheckout: string) {
    const reservasConflicto = await AppDataSource.getRepository(Reserva).find({
      relations: { habitacion: true },
      where: {
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.ACTIVA]),
        fecha_checkin: LessThan(fechaCheckout),
        fecha_checkout: MoreThan(fechaCheckin),
      },
    });

    const habitacionesOcupadas = Array.from(
      new Set(
        reservasConflicto
          .map((reserva) => reserva.habitacion?.id)
          .filter((id): id is number => id !== undefined),
      ),
    );

    return this.find({
      relations: { tipo_habitacion: true },
      where:
        habitacionesOcupadas.length > 0
          ? {
              estado: EstadoHabitacion.DISPONIBLE,
              id: Not(In(habitacionesOcupadas)),
            }
          : { estado: EstadoHabitacion.DISPONIBLE },
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
