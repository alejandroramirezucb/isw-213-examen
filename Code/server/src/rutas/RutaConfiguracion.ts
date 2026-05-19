import { Router, Request, Response } from 'express';
import { ControladorConfiguracion } from '../control/ControladorConfiguracion';

const router = Router();
const controlador = new ControladorConfiguracion();

router.get('/', (req: Request, res: Response) => controlador.listar(req, res));

router.patch('/:clave', (req: Request, res: Response) =>
  controlador.actualizar(req, res),
);

export default router;
