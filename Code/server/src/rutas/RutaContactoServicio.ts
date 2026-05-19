import { Router, Request, Response } from 'express';
import { ControladorContactoServicio } from '../control/ControladorContactoServicio';

const router = Router();
const controlador = new ControladorContactoServicio();

router.get('/activos', (req: Request, res: Response) =>
  controlador.listarActivos(req, res),
);

router.get('/', (req: Request, res: Response) =>
  controlador.buscarPorNombre(req, res),
);

export default router;
