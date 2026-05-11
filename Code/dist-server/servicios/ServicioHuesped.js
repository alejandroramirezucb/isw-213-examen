"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioHuesped = void 0;
const ts_results_1 = require("ts-results");
const RepositorioHuesped_1 = require("../repositorio/RepositorioHuesped");
class ServicioHuesped {
    async registrar(dto) {
        const existe = await RepositorioHuesped_1.RepositorioHuesped.buscarPorDocumento(dto.tipo_documento, dto.numero_documento);
        if (existe) {
            return (0, ts_results_1.Err)('DOCUMENTO_YA_REGISTRADO');
        }
        const huesped = RepositorioHuesped_1.RepositorioHuesped.create({
            tipo_documento: dto.tipo_documento,
            numero_documento: dto.numero_documento,
            nombres: dto.nombres,
            apellidos: dto.apellidos,
            correo_reserva: dto.correo,
            telefono: dto.telefono ?? null,
        });
        return (0, ts_results_1.Ok)(await RepositorioHuesped_1.RepositorioHuesped.save(huesped));
    }
    async buscarPorId(id) {
        const huesped = await RepositorioHuesped_1.RepositorioHuesped.findOneBy({ id });
        if (!huesped) {
            return (0, ts_results_1.Err)('HUESPED_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(huesped);
    }
    async buscarPorDocumento(tipo, numero) {
        const huesped = await RepositorioHuesped_1.RepositorioHuesped.buscarPorDocumento(tipo, numero);
        if (!huesped) {
            return (0, ts_results_1.Err)('HUESPED_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(huesped);
    }
    async buscarPorNombres(termino) {
        return (0, ts_results_1.Ok)(await RepositorioHuesped_1.RepositorioHuesped.buscarPorNombres(termino));
    }
    async listar() {
        return (0, ts_results_1.Ok)(await RepositorioHuesped_1.RepositorioHuesped.buscarTodas());
    }
    async actualizar(id, dto) {
        const { affected } = await RepositorioHuesped_1.RepositorioHuesped.update(id, dto);
        if (!affected) {
            return (0, ts_results_1.Err)('HUESPED_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(undefined);
    }
}
exports.ServicioHuesped = ServicioHuesped;
