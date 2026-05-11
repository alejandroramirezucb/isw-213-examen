"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorHabitacion = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioHabitacion_1 = require("../servicios/ServicioHabitacion");
class ControladorHabitacion {
    servicio = new ServicioHabitacion_1.ServicioHabitacion();
    async listar(_req, res) {
        const resultado = await this.servicio.listar();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarPorId(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async listarDisponibles(req, res) {
        const fechaCheckin = typeof req.query.fecha_checkin === 'string'
            ? req.query.fecha_checkin
            : undefined;
        const fechaCheckout = typeof req.query.fecha_checkout === 'string'
            ? req.query.fecha_checkout
            : undefined;
        const resultado = await this.servicio.listarDisponibles(fechaCheckin, fechaCheckout);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async listarPorPiso(req, res) {
        const piso = Number(req.params.piso);
        const resultado = await this.servicio.listarPorPiso(piso);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async cambiarEstado(req, res) {
        const id = Number(req.params.id);
        const { estado } = req.body;
        const resultado = await this.servicio.cambiarEstado(id, estado);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorHabitacion = ControladorHabitacion;
