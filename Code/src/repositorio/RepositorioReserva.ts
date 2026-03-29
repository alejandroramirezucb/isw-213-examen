import { Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Reserva, EstadoReserva } from '../modelos/Reserva';

export const RepositorioReserva = AppDataSource.getRepository(Reserva).extend({
  findActivas() {
    return this.find({
      relations: { habitacion: true },
      where: {
        estado: Not(EstadoReserva.CANCELADA),
      },
      order: { fecha_checkin: 'ASC' },
    });
  },

  findByHabitacion(idHabitacion: number) {
    return this.find({
      relations: { habitacion: true },
      where: {
        habitacion: { id: idHabitacion },
        estado: Not(EstadoReserva.CANCELADA),
      },
      order: { fecha_checkin: 'ASC' },
    });
  },

  findConHuespedes(idReserva: number) {
    return this.findOne({
      relations: {
        reserva_huespedes: { huesped: true },
        habitacion: true,
        estancia: true,
      },
      where: { id: idReserva },
    });
  },

  findByEstado(estado: EstadoReserva) {
    return this.findBy({ estado });
  },
});
