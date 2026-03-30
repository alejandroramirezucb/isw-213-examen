import { Router, Request, Response } from 'express';
import { ControladorReserva } from '../control/ControladorReserva';

const router = Router();
const controlador = new ControladorReserva();

router.get('/activas', (req: Request, res: Response) => {
  controlador.listarActivas(req, res);
});

router.post('/', (req: Request, res: Response) => {
  controlador.crear(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  controlador.buscarPorId(req, res);
});

router.get('/:id/huespedes', (req: Request, res: Response) => {
  controlador.buscarConHuespedes(req, res);
});

router.put('/:id/cancelar', (req: Request, res: Response) => {
  controlador.cancelar(req, res);
});

export default router;
