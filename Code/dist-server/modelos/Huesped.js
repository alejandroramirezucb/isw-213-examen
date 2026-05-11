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
exports.Huesped = exports.TipoDocumento = void 0;
const typeorm_1 = require("typeorm");
var TipoDocumento;
(function (TipoDocumento) {
    TipoDocumento["CARNET"] = "carnet";
    TipoDocumento["CARNET_EXTRANJERO"] = "carnet_extranjero";
    TipoDocumento["PASAPORTE"] = "pasaporte";
    TipoDocumento["NIT"] = "nit";
})(TipoDocumento || (exports.TipoDocumento = TipoDocumento = {}));
let Huesped = class Huesped {
    id;
    tipo_documento;
    numero_documento;
    nombres;
    apellidos;
    correo_reserva;
    telefono;
    creado_en;
    actualizado_en;
};
exports.Huesped = Huesped;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Huesped.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoDocumento,
        default: TipoDocumento.CARNET,
    }),
    __metadata("design:type", String)
], Huesped.prototype, "tipo_documento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Huesped.prototype, "numero_documento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Huesped.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Huesped.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo', type: 'text' }),
    __metadata("design:type", String)
], Huesped.prototype, "correo_reserva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Huesped.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Huesped.prototype, "creado_en", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Huesped.prototype, "actualizado_en", void 0);
exports.Huesped = Huesped = __decorate([
    (0, typeorm_1.Entity)('huespedes'),
    (0, typeorm_1.Unique)('uq_huespedes_documento', ['tipo_documento', 'numero_documento']),
    (0, typeorm_1.Check)('chk_huespedes_correo', "correo LIKE '%@%'")
], Huesped);
