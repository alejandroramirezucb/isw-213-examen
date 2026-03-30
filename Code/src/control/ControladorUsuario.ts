import { Request, Response } from 'express';
import { RespuestaHttp } from '../config/RespuestaHttp';
import { ServicioUsuario } from '../servicios/ServicioUsuario';
import { CrearUsuarioDTO } from '../dtos/Usuario/CrearUsuarioDTO';
import { AutenticarUsuarioDTO } from '../dtos/Usuario/AutenticarUsuarioDTO';

export class ControladorUsuario {
  private servicio = new ServicioUsuario();

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(req.body as CrearUsuarioDTO);
    new RespuestaHttp(resultado).enviar(res, 201);
  }

  async autenticar(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.autenticar(
      req.body as AutenticarUsuarioDTO,
    );
    new RespuestaHttp(resultado).enviar(res);
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    new RespuestaHttp(resultado).enviar(res);
  }

  async desactivar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.desactivar(id);
    new RespuestaHttp(resultado).enviar(res);
  }
}
