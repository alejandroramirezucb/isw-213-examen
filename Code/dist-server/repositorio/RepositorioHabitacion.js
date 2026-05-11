"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioHabitacion = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const Habitacion_1 = require("../modelos/Habitacion");
const Reserva_1 = require("../modelos/Reserva");
const typeorm_1 = require("typeorm");
exports.RepositorioHabitacion = BaseDatos_1.AppDataSource.getRepository(Habitacion_1.Habitacion).extend({
    buscarTodas() {
        return this.find({
            relations: { tipo_habitacion: true },
            order: { numero_habitacion: 'ASC' },
        });
    },
    buscarConTipo(id) {
        return this.findOne({
            relations: { tipo_habitacion: true },
            where: { id },
        });
    },
    buscarDisponibles() {
        return this.find({
            relations: { tipo_habitacion: true },
            where: { estado: Habitacion_1.EstadoHabitacion.DISPONIBLE },
            order: { numero_habitacion: 'ASC' },
        });
    },
    async buscarDisponiblesEnRango(fechaCheckin, fechaCheckout) {
        const reservasConflicto = await BaseDatos_1.AppDataSource.getRepository(Reserva_1.Reserva).find({
            relations: { habitacion: true },
            where: {
                estado: (0, typeorm_1.In)([Reserva_1.EstadoReserva.PENDIENTE, Reserva_1.EstadoReserva.ACTIVA]),
                fecha_checkin: (0, typeorm_1.LessThan)(fechaCheckout),
                fecha_checkout: (0, typeorm_1.MoreThan)(fechaCheckin),
            },
        });
        const habitacionesOcupadas = Array.from(new Set(reservasConflicto
            .map((reserva) => reserva.habitacion?.id)
            .filter((id) => id !== undefined)));
        return this.find({
            relations: { tipo_habitacion: true },
            where: habitacionesOcupadas.length > 0
                ? {
                    estado: Habitacion_1.EstadoHabitacion.DISPONIBLE,
                    id: (0, typeorm_1.Not)((0, typeorm_1.In)(habitacionesOcupadas)),
                }
                : { estado: Habitacion_1.EstadoHabitacion.DISPONIBLE },
            order: { numero_habitacion: 'ASC' },
        });
    },
    buscarPorPiso(piso) {
        return this.find({
            relations: { tipo_habitacion: true },
            where: { piso },
            order: { numero_habitacion: 'ASC' },
        });
    },
    buscarPorEstado(estado) {
        return this.findBy({ estado });
    },
});
