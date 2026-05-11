"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControladorConfiguracion_1 = require("../control/ControladorConfiguracion");
const router = (0, express_1.Router)();
const controlador = new ControladorConfiguracion_1.ControladorConfiguracion();
router.get('/', (req, res) => controlador.listar(req, res));
router.patch('/:clave', (req, res) => controlador.actualizar(req, res));
exports.default = router;
