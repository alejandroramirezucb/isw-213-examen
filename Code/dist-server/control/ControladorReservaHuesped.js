"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorReservaHuesped = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioReservaHuesped_1 = require("../servicios/ServicioReservaHuesped");
class ControladorReservaHuesped {
    servicio = new ServicioReservaHuesped_1.ServicioReservaHuesped();
    async listarPorReserva(req, res) {
        const idReserva = Number(req.params.idReserva);
        const resultado = await this.servicio.listarPorReserva(idReserva);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async agregarHuesped(req, res) {
        const idReserva = Number(req.params.idReserva);
        const { idHuesped } = req.body;
        const resultado = await this.servicio.agregarHuesped(idReserva, idHuesped);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async quitarHuesped(req, res) {
        const idReserva = Number(req.params.idReserva);
        const idHuesped = Number(req.params.idHuesped);
        const resultado = await this.servicio.quitarHuesped(idReserva, idHuesped);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async cambiarTitular(req, res) {
        const idReserva = Number(req.params.idReserva);
        const { idHuespedNuevo } = req.body;
        const resultado = await this.servicio.cambiarTitular(idReserva, idHuespedNuevo);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorReservaHuesped = ControladorReservaHuesped;
