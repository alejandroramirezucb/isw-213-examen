"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorContactoServicio = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioContactoServicio_1 = require("../servicios/ServicioContactoServicio");
class ControladorContactoServicio {
    servicio = new ServicioContactoServicio_1.ServicioContactoServicio();
    async listarActivos(_req, res) {
        const resultado = await this.servicio.listarActivos();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorNombre(req, res) {
        const { nombre } = req.query;
        const resultado = await this.servicio.buscarPorNombre(nombre);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorContactoServicio = ControladorContactoServicio;
