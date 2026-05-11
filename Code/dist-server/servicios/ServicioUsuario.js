"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioUsuario = void 0;
const ts_results_1 = require("ts-results");
const RepositorioUsuario_1 = require("../repositorio/RepositorioUsuario");
class ServicioUsuario {
    async crear(dto) {
        const existe = await RepositorioUsuario_1.RepositorioUsuario.buscarPorCorreo(dto.correo);
        if (existe) {
            return (0, ts_results_1.Err)('CORREO_DUPLICADO');
        }
        const usuario = RepositorioUsuario_1.RepositorioUsuario.create({
            correo_auth: dto.correo,
            password: dto.password,
            rol: dto.rol,
        });
        if (dto.id_huesped) {
            usuario.huesped = { id: dto.id_huesped };
        }
        return (0, ts_results_1.Ok)(await RepositorioUsuario_1.RepositorioUsuario.save(usuario));
    }
    async autenticar(dto) {
        const usuario = await RepositorioUsuario_1.RepositorioUsuario.buscarPorCorreo(dto.correo);
        if (!usuario || usuario.password !== dto.password) {
            return (0, ts_results_1.Err)('CREDENCIALES_INVALIDAS');
        }
        return (0, ts_results_1.Ok)(usuario);
    }
    async buscarPorId(id) {
        const usuario = await RepositorioUsuario_1.RepositorioUsuario.findOneBy({ id });
        if (!usuario) {
            return (0, ts_results_1.Err)('USUARIO_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(usuario);
    }
    async desactivar(id) {
        const { affected } = await RepositorioUsuario_1.RepositorioUsuario.update(id, { activo: false });
        if (!affected) {
            return (0, ts_results_1.Err)('USUARIO_NO_ENCONTRADO');
        }
        return (0, ts_results_1.Ok)(undefined);
    }
}
exports.ServicioUsuario = ServicioUsuario;
