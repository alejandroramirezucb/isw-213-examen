import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioHabitacion } from '../servicios/ServicioHabitacion';
import { EstadoHabitacion } from '../modelos/Habitacion';

export class ControladorHabitacion {
  private servicio = new ServicioHabitacion();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async listarDisponibles(req: Request, res: Response): Promise<void> {
    const fechaCheckin =
      typeof req.query.fecha_checkin === 'string'
        ? req.query.fecha_checkin
        : undefined;
    const fechaCheckout =
      typeof req.query.fecha_checkout === 'string'
        ? req.query.fecha_checkout
        : undefined;
    const resultado = await this.servicio.listarDisponibles(
      fechaCheckin,
      fechaCheckout,
    );
    new RespuestaHttp(resultado).enviar(res);
  }

  async listarPorPiso(req: Request, res: Response): Promise<void> {
    const piso = Number(req.params.piso);
    const resultado = await this.servicio.listarPorPiso(piso);
    new RespuestaHttp(resultado).enviar(res);
  }

  async cambiarEstado(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { estado } = req.body as { estado: EstadoHabitacion };
    const resultado = await this.servicio.cambiarEstado(id, estado);
    new RespuestaHttp(resultado).enviar(res);
  }
}
