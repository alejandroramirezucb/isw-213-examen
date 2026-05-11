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
exports.ReservaHuesped = void 0;
const typeorm_1 = require("typeorm");
const Reserva_1 = require("./Reserva");
const Huesped_1 = require("./Huesped");
let ReservaHuesped = class ReservaHuesped {
    id_reserva;
    id_huesped;
    es_titular;
    reserva;
    huesped;
};
exports.ReservaHuesped = ReservaHuesped;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ReservaHuesped.prototype, "id_reserva", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ReservaHuesped.prototype, "id_huesped", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ReservaHuesped.prototype, "es_titular", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Reserva_1.Reserva, (reserva) => reserva.reserva_huespedes, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id_reserva' }),
    __metadata("design:type", Reserva_1.Reserva)
], ReservaHuesped.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Huesped_1.Huesped, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_huesped' }),
    __metadata("design:type", Huesped_1.Huesped)
], ReservaHuesped.prototype, "huesped", void 0);
exports.ReservaHuesped = ReservaHuesped = __decorate([
    (0, typeorm_1.Entity)('reserva_huespedes'),
    (0, typeorm_1.Index)('idx_reserva_huespedes_titular', ['id_reserva'], {
        unique: true,
        where: 'es_titular = TRUE',
    })
], ReservaHuesped);
