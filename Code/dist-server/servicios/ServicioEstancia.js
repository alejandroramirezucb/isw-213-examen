"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioEstancia = void 0;
const ts_results_1 = require("ts-results");
const RepositorioEstancia_1 = require("../repositorio/RepositorioEstancia");
const RepositorioReserva_1 = require("../repositorio/RepositorioReserva");
const RepositorioConfiguracion_1 = require("../repositorio/RepositorioConfiguracion");
const Reserva_1 = require("../modelos/Reserva");
class ServicioEstancia {
    async esSalidaTardia() {
        const horaLimite = await RepositorioConfiguracion_1.RepositorioConfiguracion.obtenerTexto('late_checkout_hora_limite', '12:00');
        const [hora, minutos] = horaLimite.split(':').map(Number);
        const ahora = new Date();
        return (ahora.getHours() > hora ||
            (ahora.getHours() === hora && ahora.getMinutes() > minutos));
    }
    async registrarCheckin(idReserva, dto) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.findOneBy({ id: idReserva });
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        if (reserva.estado !== Reserva_1.EstadoReserva.PENDIENTE) {
            return (0, ts_results_1.Err)('ESTADO_INVALIDO');
        }
        const existe = await RepositorioEstancia_1.RepositorioEstancia.buscarPorReserva(idReserva);
        if (existe) {
            return (0, ts_results_1.Err)('CHECKIN_YA_REGISTRADO');
        }
        const nuevaEstancia = RepositorioEstancia_1.RepositorioEstancia.create({
            reserva: { id: idReserva },
            registrado_checkin_por: dto.registrado_por ?? null,
            observaciones_checkin: dto.observaciones ?? null,
        });
        const estancia = await RepositorioEstancia_1.RepositorioEstancia.save(nuevaEstancia);
        await RepositorioReserva_1.RepositorioReserva.update(idReserva, {
            estado: Reserva_1.EstadoReserva.ACTIVA,
        });
        return (0, ts_results_1.Ok)(estancia);
    }
    async registrarCheckout(idReserva, dto) {
        const estancia = await RepositorioEstancia_1.RepositorioEstancia.buscarPorReserva(idReserva);
        if (!estancia) {
            return (0, ts_results_1.Err)('ESTANCIA_NO_ENCONTRADA');
        }
        if (estancia.timestamp_checkout) {
            return (0, ts_results_1.Err)('CHECKOUT_YA_REGISTRADO');
        }
        const esTardia = await this.esSalidaTardia();
        await RepositorioEstancia_1.RepositorioEstancia.update(estancia.id, {
            timestamp_checkout: new Date(),
            es_late_checkout: esTardia,
            registrado_checkout_por: dto.registrado_por ?? null,
            observaciones_checkout: dto.observaciones ?? null,
        });
        await RepositorioReserva_1.RepositorioReserva.update(idReserva, {
            estado: Reserva_1.EstadoReserva.COMPLETADA,
        });
        return (0, ts_results_1.Ok)(undefined);
    }
    async buscarPorReserva(idReserva) {
        const estancia = await RepositorioEstancia_1.RepositorioEstancia.buscarPorReserva(idReserva);
        if (!estancia) {
            return (0, ts_results_1.Err)('ESTANCIA_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(estancia);
    }
    async listarAbiertas() {
        return (0, ts_results_1.Ok)(await RepositorioEstancia_1.RepositorioEstancia.buscarAbiertas());
    }
}
exports.ServicioEstancia = ServicioEstancia;
