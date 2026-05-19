import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioCancelacion } from '../servicios/ServicioCancelacion';

export class ControladorCancelacion {
  private servicio = new ServicioCancelacion();

  async buscarPorReserva(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.buscarPorReserva(idReserva);
    new RespuestaHttp(resultado).enviar(res);
  }

  async listarConMora(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarConMora();
    new RespuestaHttp(resultado).enviar(res);
  }
}
