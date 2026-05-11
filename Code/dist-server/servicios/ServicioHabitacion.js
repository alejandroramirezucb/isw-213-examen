"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioHabitacion = void 0;
const ts_results_1 = require("ts-results");
const RepositorioHabitacion_1 = require("../repositorio/RepositorioHabitacion");
const RepositorioReserva_1 = require("../repositorio/RepositorioReserva");
const Habitacion_1 = require("../modelos/Habitacion");
class ServicioHabitacion {
    async listar() {
        return (0, ts_results_1.Ok)(await RepositorioHabitacion_1.RepositorioHabitacion.buscarTodas());
    }
    async buscarPorId(id) {
        const habitacion = await RepositorioHabitacion_1.RepositorioHabitacion.buscarConTipo(id);
        if (!habitacion) {
            return (0, ts_results_1.Err)('HABITACION_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(habitacion);
    }
    async listarDisponibles(fechaCheckin, fechaCheckout) {
        if (!fechaCheckin && !fechaCheckout) {
            return (0, ts_results_1.Ok)(await RepositorioHabitacion_1.RepositorioHabitacion.buscarDisponibles());
        }
        if (!fechaCheckin || !fechaCheckout) {
            return (0, ts_results_1.Err)('RANGO_FECHAS_INVALIDO');
        }
        const inicio = new Date(fechaCheckin);
        const fin = new Date(fechaCheckout);
        if (Number.isNaN(inicio.getTime()) ||
            Number.isNaN(fin.getTime()) ||
            fin <= inicio) {
            return (0, ts_results_1.Err)('RANGO_FECHAS_INVALIDO');
        }
        return (0, ts_results_1.Ok)(await RepositorioHabitacion_1.RepositorioHabitacion.buscarDisponiblesEnRango(fechaCheckin, fechaCheckout));
    }
    async listarPorPiso(piso) {
        return (0, ts_results_1.Ok)(await RepositorioHabitacion_1.RepositorioHabitacion.buscarPorPiso(piso));
    }
    async cambiarEstado(id, estado) {
        const habitacion = await RepositorioHabitacion_1.RepositorioHabitacion.findOneBy({ id });
        if (!habitacion) {
            return (0, ts_results_1.Err)('HABITACION_NO_ENCONTRADA');
        }
        if (estado === Habitacion_1.EstadoHabitacion.DISPONIBLE) {
            const tieneActivas = await RepositorioReserva_1.RepositorioReserva.tieneReservasActivas(id);
            if (tieneActivas) {
                return (0, ts_results_1.Err)('HABITACION_CON_RESERVA_ACTIVA');
            }
        }
        await RepositorioHabitacion_1.RepositorioHabitacion.update(id, { estado });
        return (0, ts_results_1.Ok)(undefined);
    }
}
exports.ServicioHabitacion = ServicioHabitacion;
