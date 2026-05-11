"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioCancelacion = void 0;
const ts_results_1 = require("ts-results");
const RepositorioCancelacion_1 = require("../repositorio/RepositorioCancelacion");
class ServicioCancelacion {
    async buscarPorReserva(idReserva) {
        const cancelacion = await RepositorioCancelacion_1.RepositorioCancelacion.buscarPorReserva(idReserva);
        if (!cancelacion) {
            return (0, ts_results_1.Err)('CANCELACION_NO_ENCONTRADA');
        }
        return (0, ts_results_1.Ok)(cancelacion);
    }
    async listarConMora() {
        return (0, ts_results_1.Ok)(await RepositorioCancelacion_1.RepositorioCancelacion.buscarConMora());
    }
}
exports.ServicioCancelacion = ServicioCancelacion;
