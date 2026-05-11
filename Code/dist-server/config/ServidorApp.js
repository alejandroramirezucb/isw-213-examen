"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServidorApp = void 0;
const express_1 = __importDefault(require("express"));
const BaseDatos_1 = require("./BaseDatos");
const RutaCancelacion_1 = __importDefault(require("../rutas/RutaCancelacion"));
const RutaConfiguracion_1 = __importDefault(require("../rutas/RutaConfiguracion"));
const RutaContactoServicio_1 = __importDefault(require("../rutas/RutaContactoServicio"));
const RutaEstancia_1 = __importDefault(require("../rutas/RutaEstancia"));
const RutaHabitacion_1 = __importDefault(require("../rutas/RutaHabitacion"));
const RutaHuesped_1 = __importDefault(require("../rutas/RutaHuesped"));
const RutaReserva_1 = __importDefault(require("../rutas/RutaReserva"));
const RutaTipoHabitacion_1 = __importDefault(require("../rutas/RutaTipoHabitacion"));
const RutaUsuario_1 = __importDefault(require("../rutas/RutaUsuario"));
class ServidorApp {
    app = (0, express_1.default)();
    puerto = Number(process.env.PORT ?? 5000);
    constructor() {
        this.configurarMiddleware();
        this.configurarRutas();
    }
    configurarMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(this.cors);
    }
    cors = (_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    };
    configurarRutas() {
        this.app.use('/api/huesped', RutaHuesped_1.default);
        this.app.use('/api/habitacion', RutaHabitacion_1.default);
        this.app.use('/api/tipo-habitacion', RutaTipoHabitacion_1.default);
        this.app.use('/api/reserva', RutaReserva_1.default);
        this.app.use('/api/estancia', RutaEstancia_1.default);
        this.app.use('/api/contacto-servicio', RutaContactoServicio_1.default);
        this.app.use('/api/usuario', RutaUsuario_1.default);
        this.app.use('/api/cancelacion', RutaCancelacion_1.default);
        this.app.use('/api/configuracion', RutaConfiguracion_1.default);
    }
    async iniciar() {
        await BaseDatos_1.AppDataSource.initialize();
        this.app.listen(this.puerto);
    }
}
exports.ServidorApp = ServidorApp;
