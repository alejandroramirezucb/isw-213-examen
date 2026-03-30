import { Request, Response } from 'express';
import { manejarResult, enviar } from './ManejarResult';
import { ServicioUsuario } from '../servicios/ServicioUsuario';
import { CrearUsuarioDTO } from '../dtos/Usuario/CrearUsuarioDTO';
import { AutenticarUsuarioDTO } from '../dtos/Usuario/AutenticarUsuarioDTO';

export class ControladorUsuario {
  private servicio = new ServicioUsuario();

  async crear(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.crear(req.body as CrearUsuarioDTO);
    enviar(res, manejarResult(resultado), 201);
  }

  async autenticar(req: Request, res: Response): Promise<void> {
    const resultado = await this.servicio.autenticar(
      req.body as AutenticarUsuarioDTO,
    );
    enviar(res, manejarResult(resultado));
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.buscarPorId(id);
    enviar(res, manejarResult(resultado));
  }

  async desactivar(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const resultado = await this.servicio.desactivar(id);
    enviar(res, manejarResult(resultado));
  }
}
