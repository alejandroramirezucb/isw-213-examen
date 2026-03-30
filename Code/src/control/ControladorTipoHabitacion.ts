import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioTipoHabitacion } from '../servicios/ServicioTipoHabitacion';
import { CrearTipoHabitacionDTO } from '../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { ActualizarTipoHabitacionDTO } from '../dtos/TiposHabitacion/ActualizarTipoHabitacionDTO';

export class ControladorTipoHabitacion {
  private servicio = new ServicioTipoHabitacion();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    enviar(res, manejarResult(resultado));
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    enviar(res, manejarResult(resultado));
  }

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(
      req.body as CrearTipoHabitacionDTO,
    );
    enviar(res, manejarResult(resultado), 201);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.actualizar(
      id,
      req.body as ActualizarTipoHabitacionDTO,
    );
    enviar(res, manejarResult(resultado));
  }
}
