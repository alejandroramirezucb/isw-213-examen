import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioHuesped } from '../servicios/ServicioHuesped';
import { TipoDocumento } from '../modelos/Huesped';
import { CrearHuespedDTO } from '../dtos/Huesped/CrearHuespedDTO';
import { ActualizarHuespedDTO } from '../dtos/Huesped/ActualizarHuespedDTO';

export class ControladorHuesped {
  private servicio = new ServicioHuesped();

  async listar(_req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.listar();
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorDocumento(req: Request, res: Response): Promise<void> {
    const { tipo, numero } = req.query as {
      tipo: TipoDocumento;
      numero: string;
    };
    const resultado = await this.servicio.buscarPorDocumento(tipo, numero);
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorNombres(req: Request, res: Response): Promise<void> {
    const { termino } = req.query as { termino: string };
    const resultado = await this.servicio.buscarPorNombres(termino);
    new RespuestaHttp(resultado).enviar(res);
  }

  async registrar(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.registrar(
      req.body as CrearHuespedDTO,
    );
    new RespuestaHttp(resultado).enviar(res, 201);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.actualizar(
      id,
      req.body as ActualizarHuespedDTO,
    );
    new RespuestaHttp(resultado).enviar(res);
  }
}
