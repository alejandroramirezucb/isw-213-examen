"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioCancelacion = void 0;
const typeorm_1 = require("typeorm");
const BaseDatos_1 = require("../config/BaseDatos");
const Cancelacion_1 = require("../modelos/Cancelacion");
exports.RepositorioCancelacion = BaseDatos_1.AppDataSource.getRepository(Cancelacion_1.Cancelacion).extend({
    buscarPorReserva(idReserva) {
        return this.findOne({
            where: { reserva: { id: idReserva } },
            relations: { reserva: true },
        });
    },
    buscarConMora() {
        return this.find({
            where: { monto_mora: (0, typeorm_1.MoreThan)(0) },
            order: { timestamp_cancelacion: 'DESC' },
        });
    },
});
