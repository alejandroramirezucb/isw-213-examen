import { In, LessThan, MoreThan, Not } from 'typeorm';
import { AppDataSource } from '../config/BaseDatos';
import { Reserva, EstadoReserva } from '../modelos/Reserva';

export const RepositorioReserva = AppDataSource.getRepository(Reserva).extend({
  buscarActivas() {
    return this.find({
      relations: { habitacion: true },
      where: { estado: In([EstadoReserva.PENDIENTE, EstadoReserva.ACTIVA]) },
      order: { fecha_checkin: 'ASC' },
    });
  },

  async tieneConflictoFechas(
    idHabitacion: number,
    fechaCheckin: Date,
    fechaCheckout: Date,
  ): Promise<boolean> {
    const conflictos = await this.find({
      where: {
        habitacion: { id: idHabitacion },
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.ACTIVA]),
        fecha_checkin: LessThan(fechaCheckout.toISOString()),
        fecha_checkout: MoreThan(fechaCheckin.toISOString()),
      },
    });
    return conflictos.length > 0;
  },

  buscarPorHabitacion(idHabitacion: number) {
    return this.find({
      relations: { habitacion: true },
      where: {
        habitacion: { id: idHabitacion },
        estado: Not(EstadoReserva.CANCELADA),
      },
      order: { fecha_checkin: 'ASC' },
    });
  },

  buscarConHuespedes(idReserva: number) {
    return this.findOne({
      relations: {
        reserva_huespedes: { huesped: true },
        habitacion: true,
        estancia: true,
      },
      where: { id: idReserva },
    });
  },

  buscarConHabitacion(id: number) {
    return this.findOne({
      relations: { habitacion: { tipo_habitacion: true } },
      where: { id },
    });
  },

  buscarPorEstado(estado: EstadoReserva) {
    return this.findBy({ estado });
  },

  tieneReservasActivas(idHabitacion: number): Promise<boolean> {
    return this.count({
      where: {
        habitacion: { id: idHabitacion },
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.ACTIVA]),
      },
    }).then((total) => total > 0);
  },
});
