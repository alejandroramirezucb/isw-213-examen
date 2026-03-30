import { Router, Request, Response } from 'express';
import { ControladorUsuario } from '../control/ControladorUsuario';

const router = Router();
const controlador = new ControladorUsuario();

router.post('/autenticar', (req: Request, res: Response) =>
  controlador.autenticar(req, res),
);

router.post('/', (req: Request, res: Response) => controlador.crear(req, res));

router.get('/:id', (req: Request, res: Response) =>
  controlador.buscarPorId(req, res),
);

router.delete('/:id', (req: Request, res: Response) =>
  controlador.desactivar(req, res),
);

export default router;
