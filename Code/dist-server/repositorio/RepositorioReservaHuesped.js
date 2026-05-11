"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioReservaHuesped = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const ReservaHuesped_1 = require("../modelos/ReservaHuesped");
exports.RepositorioReservaHuesped = BaseDatos_1.AppDataSource.getRepository(ReservaHuesped_1.ReservaHuesped).extend({
    buscarPorReserva(idReserva) {
        return this.find({
            relations: { huesped: true },
            where: { id_reserva: idReserva },
        });
    },
    buscarPorHuesped(idHuesped) {
        return this.find({
            relations: { reserva: true },
            where: { id_huesped: idHuesped },
            order: { reserva: { fecha_checkin: 'DESC' } },
        });
    },
    buscarTitular(idReserva) {
        return this.findOne({
            relations: { huesped: true },
            where: { id_reserva: idReserva, es_titular: true },
        });
    },
    buscarPorPareja(idReserva, idHuesped) {
        return this.findOneBy({ id_reserva: idReserva, id_huesped: idHuesped });
    },
    limpiarTitular(idReserva) {
        return this.update({ id_reserva: idReserva, es_titular: true }, { es_titular: false });
    },
    asignarTitular(idReserva, idHuesped) {
        return this.update({ id_reserva: idReserva, id_huesped: idHuesped }, { es_titular: true });
    },
});
