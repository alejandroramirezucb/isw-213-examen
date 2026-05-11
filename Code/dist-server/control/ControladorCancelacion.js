"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorCancelacion = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioCancelacion_1 = require("../servicios/ServicioCancelacion");
class ControladorCancelacion {
    servicio = new ServicioCancelacion_1.ServicioCancelacion();
    async buscarPorReserva(req, res) {
        const idReserva = Number(req.params.idReserva);
        const resultado = await this.servicio.buscarPorReserva(idReserva);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async listarConMora(_req, res) {
        const resultado = await this.servicio.listarConMora();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorCancelacion = ControladorCancelacion;
