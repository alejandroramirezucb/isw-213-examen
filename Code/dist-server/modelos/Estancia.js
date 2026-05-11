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
exports.Estancia = void 0;
const typeorm_1 = require("typeorm");
const Reserva_1 = require("./Reserva");
let Estancia = class Estancia {
    id;
    reserva;
    timestamp_checkin;
    registrado_checkin_por;
    observaciones_checkin;
    timestamp_checkout;
    es_late_checkout;
    monto_cargo_extra;
    registrado_checkout_por;
    observaciones_checkout;
    creado_en;
    actualizado_en;
};
exports.Estancia = Estancia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Estancia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Reserva_1.Reserva, (reserva) => reserva.estancia),
    (0, typeorm_1.JoinColumn)({ name: 'id_reserva' }),
    __metadata("design:type", Reserva_1.Reserva)
], Estancia.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Estancia.prototype, "timestamp_checkin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "registrado_checkin_por", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "observaciones_checkin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "timestamp_checkout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "es_late_checkout", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Estancia.prototype, "monto_cargo_extra", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "registrado_checkout_por", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Estancia.prototype, "observaciones_checkout", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Estancia.prototype, "creado_en", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Estancia.prototype, "actualizado_en", void 0);
exports.Estancia = Estancia = __decorate([
    (0, typeorm_1.Entity)('estancias'),
    (0, typeorm_1.Check)('monto_cargo_extra >= 0'),
    (0, typeorm_1.Check)('ck_checkout_consistente', '(timestamp_checkout IS NULL AND es_late_checkout IS NULL) OR ' +
        '(timestamp_checkout IS NOT NULL AND es_late_checkout IS NOT NULL)')
], Estancia);
