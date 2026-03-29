import { AppDataSource } from '../data-source';
import { Estancia } from '../modelos/Estancia';
import { IsNull } from 'typeorm';

export const RepositorioEstancia = AppDataSource.getRepository(Estancia).extend(
  {
    findByReserva(idReserva: number) {
      return this.findOne({
        relations: { reserva: true },
        where: { reserva: { id: idReserva } },
      });
    },

    findAbiertas() {
      return this.find({
        relations: { reserva: { habitacion: true } },
        where: { timestamp_checkout: IsNull() },
        order: { timestamp_checkin: 'ASC' },
      });
    },

    findLateCheckouts() {
      return this.find({
        where: { es_late_checkout: true },
        order: { timestamp_checkout: 'DESC' },
      });
    },
  },
);
