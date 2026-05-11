"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioContactoServicio = void 0;
const ts_results_1 = require("ts-results");
const RepositorioContactoServicio_1 = require("../repositorio/RepositorioContactoServicio");
class ServicioContactoServicio {
    async listarActivos() {
        return (0, ts_results_1.Ok)(await RepositorioContactoServicio_1.RepositorioContactoServicio.buscarActivos());
    }
    async buscarPorNombre(nombre) {
        const contactoServicio = await RepositorioContactoServicio_1.RepositorioContactoServicio.buscarPorNombre(nombre);
        if (!contactoServicio) {
            return (0, ts_results_1.Err)('SERVICIO_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(contactoServicio);
    }
}
exports.ServicioContactoServicio = ServicioContactoServicio;
