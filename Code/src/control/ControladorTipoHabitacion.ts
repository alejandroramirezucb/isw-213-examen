import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioTipoHabitacion } from '../servicios/ServicioTipoHabitacion';
import { CrearTipoHabitacionDTO } from '../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { ActualizarTipoHabitacionDTO } from '../dtos/TiposHabitacion/ActualizarTipoHabitacionDTO';

export class ControladorTipoHabitacion {
  private servicio = new ServicioTipoHabitacion();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(
      req.body as CrearTipoHabitacionDTO,
    );
    new RespuestaHttp(resultado).enviar(res, 201);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.actualizar(
      id,
      req.body as ActualizarTipoHabitacionDTO,
    );
    new RespuestaHttp(resultado).enviar(res);
  }
}
