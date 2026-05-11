"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Habitacion = exports.EstadoHabitacion = void 0;
const typeorm_1 = require("typeorm");
const TiposHabitacion_1 = require("./TiposHabitacion");
const Reserva_1 = require("./Reserva");
var EstadoHabitacion;
(function (EstadoHabitacion) {
    EstadoHabitacion["DISPONIBLE"] = "disponible";
    EstadoHabitacion["OCUPADA"] = "ocupada";
    EstadoHabitacion["MANTENIMIENTO"] = "mantenimiento";
    EstadoHabitacion["FUERA_DE_SERVICIO"] = "fuera_de_servicio";
})(EstadoHabitacion || (exports.EstadoHabitacion = EstadoHabitacion = {}));
let Habitacion = class Habitacion {
    id;
    numero_habitacion;
    piso;
    estado;
    tipo_habitacion;
    creado_en;
    actualizado_en;
    reservas;
};
exports.Habitacion = Habitacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Habitacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Habitacion.prototype, "numero_habitacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Habitacion.prototype, "piso", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoHabitacion,
        default: EstadoHabitacion.DISPONIBLE,
    }),
    __metadata("design:type", String)
], Habitacion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TiposHabitacion_1.TiposHabitacion, (tipo_habitacion) => tipo_habitacion.habitaciones),
    (0, typeorm_1.JoinColumn)({ name: 'id_tipo_habitacion' }),
    __metadata("design:type", TiposHabitacion_1.TiposHabitacion)
], Habitacion.prototype, "tipo_habitacion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Habitacion.prototype, "creado_en", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Habitacion.prototype, "actualizado_en", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reserva_1.Reserva, (reserva) => reserva.habitacion),
    __metadata("design:type", Array)
], Habitacion.prototype, "reservas", void 0);
exports.Habitacion = Habitacion = __decorate([
    (0, typeorm_1.Entity)('habitaciones'),
    (0, typeorm_1.Check)('chk_habitaciones_piso', 'piso >= 0')
], Habitacion);
