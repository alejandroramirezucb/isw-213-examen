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
exports.TiposHabitacion = void 0;
const typeorm_1 = require("typeorm");
const Habitacion_1 = require("./Habitacion");
let TiposHabitacion = class TiposHabitacion {
    id;
    nombre;
    descripcion;
    capacidad_maxima;
    precio_referencia;
    creado_en;
    actualizado_en;
    habitaciones;
};
exports.TiposHabitacion = TiposHabitacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], TiposHabitacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], TiposHabitacion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TiposHabitacion.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], TiposHabitacion.prototype, "capacidad_maxima", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TiposHabitacion.prototype, "precio_referencia", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TiposHabitacion.prototype, "creado_en", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TiposHabitacion.prototype, "actualizado_en", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Habitacion_1.Habitacion, (habitacion) => habitacion.tipo_habitacion),
    __metadata("design:type", Array)
], TiposHabitacion.prototype, "habitaciones", void 0);
exports.TiposHabitacion = TiposHabitacion = __decorate([
    (0, typeorm_1.Entity)('tipos_habitacion'),
    (0, typeorm_1.Check)('chk_tipos_habitacion_capacidad', 'capacidad_maxima > 0'),
    (0, typeorm_1.Check)('chk_tipos_habitacion_precio', 'precio_referencia > 0')
], TiposHabitacion);
