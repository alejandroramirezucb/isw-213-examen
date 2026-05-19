import { AppDataSource } from '../config/BaseDatos';
import { ReservaHuesped } from '../modelos/ReservaHuesped';

export const RepositorioReservaHuesped = AppDataSource.getRepository(
  ReservaHuesped,
).extend({
  buscarPorReserva(idReserva: number) {
    return this.find({
      relations: { huesped: true },
      where: { id_reserva: idReserva },
    });
  },

  buscarPorHuesped(idHuesped: number) {
    return this.find({
      relations: { reserva: true },
      where: { id_huesped: idHuesped },
      order: { reserva: { fecha_checkin: 'DESC' } },
    });
  },

  buscarTitular(idReserva: number) {
    return this.findOne({
      relations: { huesped: true },
      where: { id_reserva: idReserva, es_titular: true },
    });
  },

  buscarPorPareja(idReserva: number, idHuesped: number) {
    return this.findOneBy({ id_reserva: idReserva, id_huesped: idHuesped });
  },

  limpiarTitular(idReserva: number) {
    return this.update(
      { id_reserva: idReserva, es_titular: true },
      { es_titular: false },
    );
  },

  asignarTitular(idReserva: number, idHuesped: number) {
    return this.update(
      { id_reserva: idReserva, id_huesped: idHuesped },
      { es_titular: true },
    );
  },
});
