import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioHabitacion } from '../servicios/ServicioHabitacion';
import { EstadoHabitacion } from '../modelos/Habitacion';

export class ControladorHabitacion {
  private servicio = new ServicioHabitacion();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    enviar(res, manejarResult(resultado));
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    enviar(res, manejarResult(resultado));
  }

  async listarDisponibles(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listarDisponibles();
    enviar(res, manejarResult(resultado));
  }

  async listarPorPiso(req: Request, res: Response): Promise<void> {
    const piso = Number(req.params.piso);
    const resultado = await this.servicio.listarPorPiso(piso);
    enviar(res, manejarResult(resultado));
  }

  async cambiarEstado(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { estado } = req.body as { estado: EstadoHabitacion };
    const resultado = await this.servicio.cambiarEstado(id, estado);
    enviar(res, manejarResult(resultado));
  }
}
