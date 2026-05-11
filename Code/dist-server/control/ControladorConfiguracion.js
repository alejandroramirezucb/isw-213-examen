"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorConfiguracion = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioConfiguracion_1 = require("../servicios/ServicioConfiguracion");
class ControladorConfiguracion {
    servicio = new ServicioConfiguracion_1.ServicioConfiguracion();
    async listar(_req, res) {
        const resultado = await this.servicio.listar();
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async actualizar(req, res) {
        const { clave } = req.params;
        const { valor } = req.body;
        const resultado = await this.servicio.actualizar(clave, valor);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorConfiguracion = ControladorConfiguracion;
