"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioHuesped = void 0;
const typeorm_1 = require("typeorm");
const BaseDatos_1 = require("../config/BaseDatos");
const Huesped_1 = require("../modelos/Huesped");
exports.RepositorioHuesped = BaseDatos_1.AppDataSource.getRepository(Huesped_1.Huesped).extend({
    buscarPorDocumento(tipo, numero) {
        return this.findOneBy({ tipo_documento: tipo, numero_documento: numero });
    },
    buscarPorCorreo(correo_reserva) {
        return this.findOneBy({ correo_reserva });
    },
    buscarPorNombres(termino) {
        return this.find({
            where: [
                { nombres: (0, typeorm_1.ILike)(`%${termino}%`) },
                { apellidos: (0, typeorm_1.ILike)(`%${termino}%`) },
            ],
            order: { apellidos: 'ASC', nombres: 'ASC' },
        });
    },
    buscarTodas() {
        return this.find({ order: { apellidos: 'ASC', nombres: 'ASC' } });
    },
});
