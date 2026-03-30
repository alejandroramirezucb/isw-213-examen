import { MoreThan } from 'typeorm';
import { AppDataSource } from '../config/BaseDatos';
import { Cancelacion } from '../modelos/Cancelacion';

export const RepositorioCancelacion = AppDataSource.getRepository(
  Cancelacion,
).extend({
  buscarPorReserva(idReserva: number) {
    return this.findOne({
      where: { reserva: { id: idReserva } },
      relations: { reserva: true },
    });
  },

  buscarConMora() {
    return this.find({
      where: { monto_mora: MoreThan(0) },
      order: { timestamp_cancelacion: 'DESC' },
    });
  },
});
