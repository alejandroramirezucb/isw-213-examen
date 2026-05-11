"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControladorContactoServicio_1 = require("../control/ControladorContactoServicio");
const router = (0, express_1.Router)();
const controlador = new ControladorContactoServicio_1.ControladorContactoServicio();
router.get('/activos', (req, res) => controlador.listarActivos(req, res));
router.get('/', (req, res) => controlador.buscarPorNombre(req, res));
exports.default = router;
