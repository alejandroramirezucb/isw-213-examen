"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioUsuario = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const Usuario_1 = require("../modelos/Usuario");
exports.RepositorioUsuario = BaseDatos_1.AppDataSource.getRepository(Usuario_1.Usuario).extend({
    buscarPorCorreo(correo_auth) {
        return this.findOneBy({ correo_auth });
    },
    buscarActivos() {
        return this.findBy({ activo: true });
    },
    buscarPorRol(rol) {
        return this.findBy({ rol, activo: true });
    },
    buscarConHuesped(id) {
        return this.findOne({
            where: { id },
            relations: { huesped: true },
        });
    },
});
