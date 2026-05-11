"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorEstancia = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioEstancia_1 = require("../servicios/ServicioEstancia");
class ControladorEstancia {
    servicio = new ServicioEstancia_1.ServicioEstancia();
    async registrarCheckin(req, res) {
        const idReserva = Number(req.params.idReserva);
        const resultado = await this.servicio.registrarCheckin(idReserva, req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async registrarCheckout(req, res) {
        const idReserva = Number(req.params.idReserva);
        const resultado = await this.servicio.registrarCheckout(idReserva, req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorReserva(req, res) {
        const idReserva = Number(req.params.idReserva);
        const resultado = await this.servicio.buscarPorReserva(idReserva);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async listarAbiertas(_req, res) {
        const resultado = await this.servicio.listarAbiertas();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorEstancia = ControladorEstancia;
