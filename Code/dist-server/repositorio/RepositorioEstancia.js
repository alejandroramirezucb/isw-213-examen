"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioEstancia = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const Estancia_1 = require("../modelos/Estancia");
const typeorm_1 = require("typeorm");
exports.RepositorioEstancia = BaseDatos_1.AppDataSource.getRepository(Estancia_1.Estancia).extend({
    buscarPorReserva(idReserva) {
        return this.findOne({
            relations: { reserva: true },
            where: { reserva: { id: idReserva } },
        });
    },
    buscarAbiertas() {
        return this.find({
            relations: { reserva: { habitacion: true } },
            where: { timestamp_checkout: (0, typeorm_1.IsNull)() },
            order: { timestamp_checkin: 'ASC' },
        });
    },
});
