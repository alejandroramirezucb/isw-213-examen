import { Router, Request, Response } from 'express';
import { ControladorHabitacion } from '../control/ControladorHabitacion';

const router = Router();
const controlador = new ControladorHabitacion();

router.get('/', (req: Request, res: Response) => {
  controlador.listar(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  controlador.buscarPorId(req, res);
});

router.get('/disponibles', (req: Request, res: Response) => {
  controlador.listarDisponibles(req, res);
});

router.get('/piso/:piso', (req: Request, res: Response) => {
  controlador.listarPorPiso(req, res);
});

router.put('/:id/estado', (req: Request, res: Response) => {
  controlador.cambiarEstado(req, res);
});

export default router;
