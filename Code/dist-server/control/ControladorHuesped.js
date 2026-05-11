"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorHuesped = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioHuesped_1 = require("../servicios/ServicioHuesped");
class ControladorHuesped {
    servicio = new ServicioHuesped_1.ServicioHuesped();
    async listar(_req, res) {
        const resultado = await this.servicio.listar();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarPorId(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorDocumento(req, res) {
        const { tipo, numero } = req.query;
        const resultado = await this.servicio.buscarPorDocumento(tipo, numero);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorNombres(req, res) {
        const { termino } = req.query;
        const resultado = await this.servicio.buscarPorNombres(termino);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async registrar(req, res) {
        const resultado = await this.servicio.registrar(req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async actualizar(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.actualizar(id, req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorHuesped = ControladorHuesped;
