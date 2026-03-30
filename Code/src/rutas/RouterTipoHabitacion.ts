import { Router, Request, Response } from 'express';
import { ControladorTipoHabitacion } from '../control/ControladorTipoHabitacion';

const router = Router();
const controlador = new ControladorTipoHabitacion();

router.get('/', (req: Request, res: Response) => {
  controlador.listar(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  controlador.buscarPorId(req, res);
});

router.post('/', (req: Request, res: Response) => {
  controlador.crear(req, res);
});

router.put('/:id', (req: Request, res: Response) => {
  controlador.actualizar(req, res);
});

export default router;
