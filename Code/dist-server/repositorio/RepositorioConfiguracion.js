"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioConfiguracion = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const Configuracion_1 = require("../modelos/Configuracion");
exports.RepositorioConfiguracion = BaseDatos_1.AppDataSource.getRepository(Configuracion_1.Configuracion).extend({
    listarTodas() {
        return this.find({ order: { clave: 'ASC' } });
    },
    buscarPorClave(clave) {
        return this.findOneBy({ clave });
    },
    guardar(config) {
        return this.save(config);
    },
    async obtenerNumero(clave, defecto = 0) {
        const config = await this.findOneBy({ clave });
        return config ? parseFloat(config.valor) : defecto;
    },
    async obtenerTexto(clave, defecto = '') {
        const config = await this.findOneBy({ clave });
        return config?.valor ?? defecto;
    },
});
