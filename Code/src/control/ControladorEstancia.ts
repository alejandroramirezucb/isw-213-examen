import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
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
    enviar(res, manejarResult(resultado), 201);
  }

  async registrarCheckout(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.registrarCheckout(
      idReserva,
      req.body as RegistrarCheckoutDTO,
    );
    enviar(res, manejarResult(resultado));
  }

  async buscarPorReserva(req: Request, res: Response): Promise<void> {
    const idReserva = Number(req.params.idReserva);
    const resultado = await this.servicio.buscarPorReserva(idReserva);
    enviar(res, manejarResult(resultado));
  }

  async listarAbiertas(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarAbiertas();
    enviar(res, manejarResult(resultado));
  }
}
