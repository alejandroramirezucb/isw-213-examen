import { AppDataSource } from '../config/BaseDatos';
import { Estancia } from '../modelos/Estancia';
import { IsNull } from 'typeorm';

export const RepositorioEstancia = AppDataSource.getRepository(Estancia).extend(
  {
    buscarPorReserva(idReserva: number) {
      return this.findOne({
        relations: { reserva: true },
        where: { reserva: { id: idReserva } },
      });
    },

    buscarAbiertas() {
      return this.find({
        relations: { reserva: { habitacion: true } },
        where: { timestamp_checkout: IsNull() },
        order: { timestamp_checkin: 'ASC' },
      });
    },
  },
);
