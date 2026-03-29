import { AppDataSource } from '../data-source';
import { ReservaHuesped } from '../modelos/ReservaHuesped';

export const RepositorioReservaHuesped = AppDataSource.getRepository(
  ReservaHuesped,
).extend({
  findByReserva(idReserva: number) {
    return this.find({
      relations: { huesped: true },
      where: { id_reserva: idReserva },
    });
  },

  findByHuesped(idHuesped: number) {
    return this.find({
      relations: { reserva: true },
      where: { id_huesped: idHuesped },
      order: { reserva: { fecha_checkin: 'DESC' } },
    });
  },

  findTitular(idReserva: number) {
    return this.findOne({
      relations: { huesped: true },
      where: { id_reserva: idReserva, es_titular: true },
    });
  },
});
