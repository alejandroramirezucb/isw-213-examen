import { In, Not } from 'typeorm';
import { AppDataSource } from '../config/BaseDatos';
import { Reserva, EstadoReserva } from '../modelos/Reserva';

export const RepositorioReserva = AppDataSource.getRepository(Reserva).extend({
  findActivas() {
    return this.find({
      relations: { habitacion: true },
      where: { estado: Not(EstadoReserva.CANCELADA) },
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

  findConHabitacion(id: number) {
    return this.findOne({
      relations: { habitacion: { tipo_habitacion: true } },
      where: { id },
    });
  },

  findByEstado(estado: EstadoReserva) {
    return this.findBy({ estado });
  },

  hasReservasActivas(idHabitacion: number): Promise<boolean> {
    return this.count({
      where: {
        habitacion: { id: idHabitacion },
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.ACTIVA]),
      },
    }).then((total) => total > 0);
  },
});
