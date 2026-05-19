import { Router, Request, Response } from 'express';
import { ControladorHuesped } from '../control/ControladorHuesped';

const router = Router();
const controlador = new ControladorHuesped();

router.get('/buscar/documento', (req: Request, res: Response) =>
  controlador.buscarPorDocumento(req, res),
);

router.get('/buscar/nombres', (req: Request, res: Response) =>
  controlador.buscarPorNombres(req, res),
);

router.get('/:id', (req: Request, res: Response) =>
  controlador.buscarPorId(req, res),
);

router.get('/', (req: Request, res: Response) => controlador.listar(req, res));

router.post('/', (req: Request, res: Response) =>
  controlador.registrar(req, res),
);

router.put('/:id', (req: Request, res: Response) =>
  controlador.actualizar(req, res),
);

export default router;
