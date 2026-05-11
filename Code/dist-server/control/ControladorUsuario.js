"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorUsuario = void 0;
const RespuestaHttp_1 = require("../config/RespuestaHttp");
const ServicioUsuario_1 = require("../servicios/ServicioUsuario");
class ControladorUsuario {
    servicio = new ServicioUsuario_1.ServicioUsuario();
    async crear(req, res) {
        const resultado = await this.servicio.crear(req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res, 201);
    }
    async autenticar(req, res) {
        const resultado = await this.servicio.autenticar(req.body);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.buscarPorId(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
    async desactivar(req, res) {
        const id = Number(req.params.id);
        const resultado = await this.servicio.desactivar(id);
        new RespuestaHttp_1.RespuestaHttp(resultado).enviar(res);
    }
}
exports.ControladorUsuario = ControladorUsuario;
