import { Router, Request, Response } from 'express';
import { ControladorEstancia } from '../control/ControladorEstancia';

const router = Router();
const controlador = new ControladorEstancia();

router.get('/abiertas', (req: Request, res: Response) =>
  controlador.listarAbiertas(req, res),
);

router.get('/reserva/:idReserva', (req: Request, res: Response) =>
  controlador.buscarPorReserva(req, res),
);

router.post('/reserva/:idReserva/checkin', (req: Request, res: Response) =>
  controlador.registrarCheckin(req, res),
);

router.put('/reserva/:idReserva/checkout', (req: Request, res: Response) =>
  controlador.registrarCheckout(req, res),
);

export default router;
