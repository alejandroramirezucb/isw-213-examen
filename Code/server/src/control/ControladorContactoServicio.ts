import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioContactoServicio } from '../servicios/ServicioContactoServicio';

export class ControladorContactoServicio {
  private servicio = new ServicioContactoServicio();

  async listarActivos(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarActivos();
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorNombre(req: Request, res: Response): Promise<void> {
    const { nombre } = req.query as { nombre: string };
    const resultado = await this.servicio.buscarPorNombre(nombre);
    new RespuestaHttp(resultado).enviar(res);
  }
}
