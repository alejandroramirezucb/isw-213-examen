import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioCancelacion } from '../servicios/ServicioCancelacion';

export class ControladorCancelacion {
  private servicio = new ServicioCancelacion();

  async buscarPorReserva(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.buscarPorReserva(idReserva);
    enviar(res, manejarResult(resultado));
  }

  async listarConMora(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarConMora();
    enviar(res, manejarResult(resultado));
  }
}
