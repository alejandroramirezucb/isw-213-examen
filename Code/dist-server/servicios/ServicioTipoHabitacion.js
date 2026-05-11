"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioTipoHabitacion = void 0;
const ts_results_1 = require("ts-results");
const RepositorioTipoHabitacion_1 = require("../repositorio/RepositorioTipoHabitacion");
const FabricaTipoHabitacion_1 = require("./factory/FabricaTipoHabitacion");
class ServicioTipoHabitacion {
    async listar() {
        return (0, ts_results_1.Ok)(await RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.buscarTodas());
    }
    async buscarPorId(id) {
        const tipo = await RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.findOneBy({ id });
        if (!tipo) {
            return (0, ts_results_1.Err)('TIPO_HABITACION_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(tipo);
    }
    async crear(dto) {
        const existe = await RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.buscarPorNombre(dto.nombre);
        if (existe) {
            return (0, ts_results_1.Err)('NOMBRE_YA_REGISTRADO');
        }
        const config = FabricaTipoHabitacion_1.FabricaTipoHabitacion.crear(dto.nombre);
        if (!config) {
            return (0, ts_results_1.Err)('TIPO_HABITACION_NO_ENCONTRADO');
        }
        const tipo = RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.create({
            nombre: config.nombre,
            descripcion: config.descripcion ?? null,
            capacidad_maxima: config.capacidad_maxima,
            precio_referencia: config.precio_referencia,
        });
        return (0, ts_results_1.Ok)(await RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.save(tipo));
    }
    async actualizar(id, dto) {
        const { affected } = await RepositorioTipoHabitacion_1.RepositorioTipoHabitacion.update(id, dto);
        if (!affected) {
            return (0, ts_results_1.Err)('TIPO_HABITACION_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(undefined);
    }
}
exports.ServicioTipoHabitacion = ServicioTipoHabitacion;
