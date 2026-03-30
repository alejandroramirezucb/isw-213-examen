import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioContactoServicio } from '../servicios/ServicioContactoServicio';

export class ControladorContactoServicio {
  private servicio = new ServicioContactoServicio();

  async listarActivos(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarActivos();
    enviar(res, manejarResult(resultado));
  }

  async buscarPorNombre(req: Request, res: Response): Promise<void> {
    const { nombre } = req.query as { nombre: string };
    const resultado = await this.servicio.buscarPorNombre(nombre);
    enviar(res, manejarResult(resultado));
  }
}
