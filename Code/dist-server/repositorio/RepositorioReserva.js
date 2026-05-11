"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioReserva = void 0;
const typeorm_1 = require("typeorm");
const BaseDatos_1 = require("../config/BaseDatos");
const Reserva_1 = require("../modelos/Reserva");
exports.RepositorioReserva = BaseDatos_1.AppDataSource.getRepository(Reserva_1.Reserva).extend({
    buscarActivas() {
        return this.find({
            relations: { habitacion: true },
            where: { estado: (0, typeorm_1.In)([Reserva_1.EstadoReserva.PENDIENTE, Reserva_1.EstadoReserva.ACTIVA]) },
            order: { fecha_checkin: 'ASC' },
        });
    },
    async tieneConflictoFechas(idHabitacion, fechaCheckin, fechaCheckout) {
        const conflictos = await this.find({
            where: {
                habitacion: { id: idHabitacion },
                estado: (0, typeorm_1.In)([Reserva_1.EstadoReserva.PENDIENTE, Reserva_1.EstadoReserva.ACTIVA]),
                fecha_checkin: (0, typeorm_1.LessThan)(fechaCheckout.toISOString()),
                fecha_checkout: (0, typeorm_1.MoreThan)(fechaCheckin.toISOString()),
            },
        });
        return conflictos.length > 0;
    },
    buscarPorHabitacion(idHabitacion) {
        return this.find({
            relations: { habitacion: true },
            where: {
                habitacion: { id: idHabitacion },
                estado: (0, typeorm_1.Not)(Reserva_1.EstadoReserva.CANCELADA),
            },
            order: { fecha_checkin: 'ASC' },
        });
    },
    buscarConHuespedes(idReserva) {
        return this.findOne({
            relations: {
                reserva_huespedes: { huesped: true },
                habitacion: true,
                estancia: true,
            },
            where: { id: idReserva },
        });
    },
    buscarConHabitacion(id) {
        return this.findOne({
            relations: { habitacion: { tipo_habitacion: true } },
            where: { id },
        });
    },
    buscarPorEstado(estado) {
        return this.findBy({ estado });
    },
    async tieneReservasActivas(idHabitacion) {
        const total = await this.count({
            where: {
                habitacion: { id: idHabitacion },
                estado: (0, typeorm_1.In)([Reserva_1.EstadoReserva.PENDIENTE, Reserva_1.EstadoReserva.ACTIVA]),
            },
        });
        return total > 0;
    },
});
