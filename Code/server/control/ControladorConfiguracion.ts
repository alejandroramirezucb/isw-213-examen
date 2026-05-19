import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioConfiguracion } from '../servicios/ServicioConfiguracion';

export class ControladorConfiguracion {
  private servicio = new ServicioConfiguracion();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    new RespuestaHttp(resultado).enviar(res);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { clave } = req.params as { clave: string };
    const { valor } = req.body as { valor: string };
    const resultado = await this.servicio.actualizar(clave, valor);
    new RespuestaHttp(resultado).enviar(res);
  }
}
