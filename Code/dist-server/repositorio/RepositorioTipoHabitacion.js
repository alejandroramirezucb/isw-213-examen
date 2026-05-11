"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioTipoHabitacion = void 0;
const BaseDatos_1 = require("../config/BaseDatos");
const TiposHabitacion_1 = require("../modelos/TiposHabitacion");
exports.RepositorioTipoHabitacion = BaseDatos_1.AppDataSource.getRepository(TiposHabitacion_1.TiposHabitacion).extend({
    buscarTodas() {
        return this.find({ order: { nombre: 'ASC' } });
    },
    buscarPorNombre(nombre) {
        return this.findOneBy({ nombre });
    },
    buscarConHabitaciones() {
        return this.find({
            relations: { habitaciones: true },
            order: { nombre: 'ASC' },
        });
    },
});
