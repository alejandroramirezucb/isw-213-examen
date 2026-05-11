"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControladorCancelacion_1 = require("../control/ControladorCancelacion");
const router = (0, express_1.Router)();
const controlador = new ControladorCancelacion_1.ControladorCancelacion();
router.get('/con-mora', (req, res) => controlador.listarConMora(req, res));
router.get('/reserva/:idReserva', (req, res) => controlador.buscarPorReserva(req, res));
exports.default = router;
