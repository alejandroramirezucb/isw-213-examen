import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioReservaHuesped } from '../servicios/ServicioReservaHuesped';

export class ControladorReservaHuesped {
  private servicio = new ServicioReservaHuesped();

  async listarPorReserva(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.listarPorReserva(idReserva);
    enviar(res, manejarResult(resultado));
  }

  async agregarHuesped(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const { idHuesped } = req.body as { idHuesped: number };
    const resultado = await this.servicio.agregarHuesped(idReserva, idHuesped);
    enviar(res, manejarResult(resultado), 201);
  }

  async quitarHuesped(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const idHuesped = Number(req.params.idHuesped);
    const resultado = await this.servicio.quitarHuesped(idReserva, idHuesped);
    enviar(res, manejarResult(resultado));
  }

  async cambiarTitular(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const { idHuespedNuevo } = req.body as { idHuespedNuevo: number };
    const resultado = await this.servicio.cambiarTitular(
      idReserva,
      idHuespedNuevo,
    );
    enviar(res, manejarResult(resultado));
  }
}
