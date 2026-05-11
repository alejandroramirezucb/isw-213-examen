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
exports.Reserva = exports.EstadoReserva = void 0;
const typeorm_1 = require("typeorm");
const Habitacion_1 = require("./Habitacion");
const ReservaHuesped_1 = require("./ReservaHuesped");
const Estancia_1 = require("./Estancia");
const Cancelacion_1 = require("./Cancelacion");
var EstadoReserva;
(function (EstadoReserva) {
    EstadoReserva["PENDIENTE"] = "pendiente";
    EstadoReserva["ACTIVA"] = "activa";
    EstadoReserva["COMPLETADA"] = "completada";
    EstadoReserva["CANCELADA"] = "cancelada";
})(EstadoReserva || (exports.EstadoReserva = EstadoReserva = {}));
let Reserva = class Reserva {
    id;
    habitacion;
    fecha_checkin;
    fecha_checkout;
    cantidad_personas;
    estado;
    notas;
    creado_en;
    actualizado_en;
    reserva_huespedes;
    estancia;
    cancelacion;
};
exports.Reserva = Reserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Habitacion_1.Habitacion, (habitacion) => habitacion.reservas),
    (0, typeorm_1.JoinColumn)({ name: 'id_habitacion' }),
    __metadata("design:type", Habitacion_1.Habitacion)
], Reserva.prototype, "habitacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Reserva.prototype, "fecha_checkin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Reserva.prototype, "fecha_checkout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Reserva.prototype, "cantidad_personas", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoReserva,
        default: EstadoReserva.PENDIENTE,
    }),
    __metadata("design:type", String)
], Reserva.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Reserva.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Reserva.prototype, "creado_en", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Reserva.prototype, "actualizado_en", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReservaHuesped_1.ReservaHuesped, (reserva_huespedes) => reserva_huespedes.reserva, { cascade: true }),
    __metadata("design:type", Array)
], Reserva.prototype, "reserva_huespedes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Estancia_1.Estancia, (estancia) => estancia.reserva, {
        nullable: true,
    }),
    __metadata("design:type", Object)
], Reserva.prototype, "estancia", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Cancelacion_1.Cancelacion, (cancelacion) => cancelacion.reserva, {
        nullable: true,
    }),
    __metadata("design:type", Object)
], Reserva.prototype, "cancelacion", void 0);
exports.Reserva = Reserva = __decorate([
    (0, typeorm_1.Entity)('reservas'),
    (0, typeorm_1.Check)('chk_reservas_fechas', 'fecha_checkout > fecha_checkin')
], Reserva);
