"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioConfiguracion = void 0;
const ts_results_1 = require("ts-results");
const RepositorioConfiguracion_1 = require("../repositorio/RepositorioConfiguracion");
class ServicioConfiguracion {
    async listar() {
        return (0, ts_results_1.Ok)(await RepositorioConfiguracion_1.RepositorioConfiguracion.listarTodas());
    }
    async actualizar(clave, valor) {
        const config = await RepositorioConfiguracion_1.RepositorioConfiguracion.buscarPorClave(clave);
        if (!config) {
            return (0, ts_results_1.Err)('CONFIGURACION_NO_ENCONTRADA');
        }
        config.valor = valor;
        return (0, ts_results_1.Ok)(await RepositorioConfiguracion_1.RepositorioConfiguracion.guardar(config));
    }
}
exports.ServicioConfiguracion = ServicioConfiguracion;
