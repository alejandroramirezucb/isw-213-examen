import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioReserva } from '../servicios/ServicioReserva';
import { CrearReservaDTO } from '../dtos/Reserva/CrearReservaDTO';
import { CancelarReservaDTO } from '../dtos/Reserva/CancelarReservaDTO';

export class ControladorReserva {
  private servicio = new ServicioReserva();

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(req.body as CrearReservaDTO);
    new RespuestaHttp(resultado).enviar(res, 201);
  }

  async cancelar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.cancelar(
      id,
      req.body as CancelarReservaDTO,
    );
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarConHuespedes(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarConHuespedes(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async listarActivas(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarActivas();
    new RespuestaHttp(resultado).enviar(res);
  }
}
