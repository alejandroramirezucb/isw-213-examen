import { Router, Request, Response } from 'express';
import { ControladorReserva } from '../control/ControladorReserva';
import { ControladorReservaHuesped } from '../control/ControladorReservaHuesped';

const router = Router();
const controladorReserva = new ControladorReserva();
const controladorHuespedes = new ControladorReservaHuesped();

router.get('/activas', (req: Request, res: Response) =>
  controladorReserva.listarActivas(req, res),
);

router.post('/', (req: Request, res: Response) =>
  controladorReserva.crear(req, res),
);

router.get('/:id', (req: Request, res: Response) =>
  controladorReserva.buscarPorId(req, res),
);

router.put('/:id/cancelar', (req: Request, res: Response) =>
  controladorReserva.cancelar(req, res),
);

router.get('/:idReserva/huespedes', (req: Request, res: Response) =>
  controladorHuespedes.listarPorReserva(req, res),
);

router.post('/:idReserva/huespedes', (req: Request, res: Response) =>
  controladorHuespedes.agregarHuesped(req, res),
);

router.delete(
  '/:idReserva/huespedes/:idHuesped',
  (req: Request, res: Response) => controladorHuespedes.quitarHuesped(req, res),
);

router.put('/:idReserva/huespedes/titular', (req: Request, res: Response) =>
  controladorHuespedes.cambiarTitular(req, res),
);

export default router;
