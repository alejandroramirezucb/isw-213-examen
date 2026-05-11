"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioContactoServicio = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const ContactoServicio_1 = require("../modelos/ContactoServicio");
exports.RepositorioContactoServicio = BaseDatos_1.AppDataSource.getRepository(ContactoServicio_1.ContactoServicio).extend({
    buscarActivos() {
        return this.findBy({ activo: true });
    },
    buscarPorNombre(nombre) {
        return this.findOneBy({ nombre_servicio: nombre });
    },
});
