import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioEstancia } from '../servicios/ServicioEstancia';
import { RegistrarCheckinDTO } from '../dtos/Estancia/RegistrarCheckinDTO';
import { RegistrarCheckoutDTO } from '../dtos/Estancia/RegistrarCheckoutDTO';

export class ControladorEstancia {
  private servicio = new ServicioEstancia();

  async registrarCheckin(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.registrarCheckin(
      idReserva,
      req.body as RegistrarCheckinDTO,
    );
    new RespuestaHttp(resultado).enviar(res, 201);
  }

  async registrarCheckout(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.registrarCheckout(
      idReserva,
      req.body as RegistrarCheckoutDTO,
    );
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorReserva(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.buscarPorReserva(idReserva);
    new RespuestaHttp(resultado).enviar(res);
  }

  async listarAbiertas(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarAbiertas();
    new RespuestaHttp(resultado).enviar(res);
  }
}
