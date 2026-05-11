"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorReserva = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioReserva_1 = require("../servicios/ServicioReserva");
class ControladorReserva {
    servicio = new ServicioReserva_1.ServicioReserva();
    async crear(req, res) {
        const resultado = await this.servicio.crear(req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async cancelar(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.cancelar(id, req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarPorId(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarConHuespedes(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarConHuespedes(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async listarActivas(_req, res) {
        const resultado = await this.servicio.listarActivas();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorReserva = ControladorReserva;
