import { Router, Request, Response } from 'express';
import { ControladorReservaHuesped } from '../control/ControladorReservaHuesped';

const router = Router();
const controlador = new ControladorReservaHuesped();

router.get('/:idReserva/huespedes', (req: Request, res: Response) => {
  controlador.listarPorReserva(req, res);
});

router.post('/:idReserva/huespedes', (req: Request, res: Response) => {
  controlador.agregarHuesped(req, res);
});

router.delete('/:idReserva/huespedes/:idHuesped', (req: Request, res: Response) => {
  controlador.quitarHuesped(req, res);
});

router.put('/:idReserva/huespedes/titular', (req: Request, res: Response) => {
  controlador.cambiarTitular(req, res);
});

export default router;
