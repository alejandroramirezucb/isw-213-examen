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

  findPorPareja(idReserva: number, idHuesped: number) {
    return this.findOneBy({ id_reserva: idReserva, id_huesped: idHuesped });
  },

  clearTitular(idReserva: number) {
    return this.update({ id_reserva: idReserva, es_titular: true }, { es_titular: false });
  },

  assignTitular(idReserva: number, idHuesped: number) {
    return this.update({ id_reserva: idReserva, id_huesped: idHuesped }, { es_titular: true });
  },
});
