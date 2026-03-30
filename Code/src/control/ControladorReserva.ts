import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioReserva } from '../servicios/ServicioReserva';
import { CrearReservaDTO } from '../dtos/Reserva/CrearReservaDTO';
import { CancelarReservaDTO } from '../dtos/Reserva/CancelarReservaDTO';

export class ControladorReserva {
  private servicio = new ServicioReserva();

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(req.body as CrearReservaDTO);
    enviar(res, manejarResult(resultado), 201);
  }

  async cancelar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.cancelar(
      id,
      req.body as CancelarReservaDTO,
    );
    enviar(res, manejarResult(resultado));
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    enviar(res, manejarResult(resultado));
  }

  async buscarConHuespedes(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarConHuespedes(id);
    enviar(res, manejarResult(resultado));
  }

  async listarActivas(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarActivas();
    enviar(res, manejarResult(resultado));
  }
}
