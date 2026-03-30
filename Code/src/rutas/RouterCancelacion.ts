import { Router, Request, Response } from 'express';
import { ControladorCancelacion } from '../control/ControladorCancelacion';

const router = Router();
const controlador = new ControladorCancelacion();

router.get('/con-mora', (req: Request, res: Response) => {
  controlador.listarConMora(req, res);
});

router.get('/reserva/:idReserva', (req: Request, res: Response) => {
  controlador.buscarPorReserva(req, res);
});

export default router;
