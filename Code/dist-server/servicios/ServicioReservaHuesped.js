"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioReservaHuesped = void 0;
const ts_results_1 = require("ts-results");
const RepositorioReservaHuesped_1 = require("../repositorio/RepositorioReservaHuesped");
const RepositorioReserva_1 = require("../repositorio/RepositorioReserva");
class ServicioReservaHuesped {
    async listarPorReserva(idReserva) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.findOneBy({ id: idReserva });
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(await RepositorioReservaHuesped_1.RepositorioReservaHuesped.buscarPorReserva(idReserva));
    }
    async agregarHuesped(idReserva, idHuesped) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.findOneBy({ id: idReserva });
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        const existe = await RepositorioReservaHuesped_1.RepositorioReservaHuesped.buscarPorPareja(idReserva, idHuesped);
        if (existe) {
            return (0, ts_results_1.Err)('HUESPED_YA_EN_RESERVA');
        }
        const entrada = RepositorioReservaHuesped_1.RepositorioReservaHuesped.create({
            id_reserva: idReserva,
            id_huesped: idHuesped,
            es_titular: false,
        });
        return (0, ts_results_1.Ok)(await RepositorioReservaHuesped_1.RepositorioReservaHuesped.save(entrada));
    }
    async quitarHuesped(idReserva, idHuesped) {
        const entrada = await RepositorioReservaHuesped_1.RepositorioReservaHuesped.buscarPorPareja(idReserva, idHuesped);
        if (!entrada) {
            return (0, ts_results_1.Err)('HUESPED_NO_EN_RESERVA');
        }
        if (entrada.es_titular) {
            return (0, ts_results_1.Err)('NO_SE_PUEDE_QUITAR_TITULAR');
        }
        await RepositorioReservaHuesped_1.RepositorioReservaHuesped.delete({
            id_reserva: idReserva,
            id_huesped: idHuesped,
        });
        return (0, ts_results_1.Ok)(undefined);
    }
    async cambiarTitular(idReserva, idHuespedNuevo) {
        const reserva = await RepositorioReserva_1.RepositorioReserva.findOneBy({ id: idReserva });
        if (!reserva) {
            return (0, ts_results_1.Err)('RESERVA_NO_ENCONTRADA');
        }
        const nuevo = await RepositorioReservaHuesped_1.RepositorioReservaHuesped.buscarPorPareja(idReserva, idHuespedNuevo);
        if (!nuevo) {
            return (0, ts_results_1.Err)('HUESPED_NO_EN_RESERVA');
        }
        await RepositorioReservaHuesped_1.RepositorioReservaHuesped.limpiarTitular(idReserva);
        await RepositorioReservaHuesped_1.RepositorioReservaHuesped.asignarTitular(idReserva, idHuespedNuevo);
        return (0, ts_results_1.Ok)(undefined);
    }
}
exports.ServicioReservaHuesped = ServicioReservaHuesped;
