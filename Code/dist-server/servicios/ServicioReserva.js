"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioReserva = void 0;
const ts_results_1 = require("ts-results");
const RepositorioReserva_1 = require("../repositorio/RepositorioReserva");
const RepositorioHabitacion_1 = require("../repositorio/RepositorioHabitacion");
const RepositorioCancelacion_1 = require("../repositorio/RepositorioCancelacion");
const RepositorioReservaHuesped_1 = require("../repositorio/RepositorioReservaHuesped");
const Reserva_1 = require("../modelos/Reserva");
class ServicioReserva {
    async crear(dto) {
        const habitacion = await RepositorioHabitacion_1.RepositorioHabitacion.buscarConTipo(dto.id_habitacion);
        if (!habitacion) {
            return (0, ts_results_1.Err)('HABITACION_NO_ENCONTRADA');
        }
        if (dto.cantidad_personas > habitacion.tipo_habitacion.capacidad_maxima) {
            return (0, ts_results_1.Err)('CAPACIDAD_EXCEDIDA');
        }
        const hayConflicto = await RepositorioReserva_1.RepositorioReserva.tieneConflictoFechas(dto.id_habitacion, new Date(dto.fecha_checkin), new Date(dto.fecha_checkout));
        if (hayConflicto) {
            return (0, ts_results_1.Err)('HABITACION_NO_DISPONIBLE');
        }
        const nuevaReserva = new Reserva_1.Reserva();
        nuevaReserva.habitacion = { id: dto.id_habitacion };
        nuevaReserva.fecha_checkin = dto.fecha_checkin;
        nuevaReserva.fecha_checkout = dto.fecha_checkout;
        nuevaReserva.cantidad_personas = dto.cantidad_personas;
        nuevaReserva.estado = Reserva_1.EstadoReserva.PENDIENTE;
        nuevaReserva.notas = dto.notas ?? null;
        const reserva = await RepositorioReserva_1.RepositorioReserva.save(nuevaReserva);
        const titular = RepositorioReservaHuesped_1.RepositorioReservaHuesped.create({
            id_reserva: reserva.id,
            id_huesped: dto.id_huesped_titular,
            es_titular: true,
        });
        await RepositorioReservaHuesped_1.RepositorioReservaHuesped.save(titular);
        return (0, ts_results_1.Ok)(reserva);
    }
    async cancelar(id, dto) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.findOneBy({ id });
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        if (reserva.estado === Reserva_1.EstadoReserva.CANCELADA) {
            return (0, ts_results_1.Err)('YA_CANCELADA');
        }
        const cancelacion = RepositorioCancelacion_1.RepositorioCancelacion.create({
            reserva: { id },
            motivo: dto.motivo ?? null,
            registrado_por: dto.registrado_por ?? null,
        });
        await RepositorioCancelacion_1.RepositorioCancelacion.save(cancelacion);
        await RepositorioReserva_1.RepositorioReserva.update(id, { estado: Reserva_1.EstadoReserva.CANCELADA });
        return (0, ts_results_1.Ok)(undefined);
    }
    async buscarPorId(id) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.buscarConHabitacion(id);
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(reserva);
    }
    async buscarConHuespedes(id) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.buscarConHuespedes(id);
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(reserva);
    }
    async listarActivas() {
        return (0, ts_results_1.Ok)(await RepositorioReserva_1.RepositorioReserva.buscarActivas());
    }
}
exports.ServicioReserva = ServicioReserva;
