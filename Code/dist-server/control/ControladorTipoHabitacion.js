"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorTipoHabitacion = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioTipoHabitacion_1 = require("../servicios/ServicioTipoHabitacion");
class ControladorTipoHabitacion {
    servicio = new ServicioTipoHabitacion_1.ServicioTipoHabitacion();
    async listar(_req, res) {
        const resultado = await this.servicio.listar();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarPorId(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async crear(req, res) {
        const resultado = await this.servicio.crear(req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async actualizar(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.actualizar(id, req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorTipoHabitacion = ControladorTipoHabitacion;
