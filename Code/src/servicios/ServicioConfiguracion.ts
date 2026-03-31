import { Ok, Err, Result } from 'ts-results';
import { RepositorioConfiguracion } from '../repositorio/RepositorioConfiguracion';
import { Configuracion } from '../modelos/Configuracion';

type ErrorConfiguracion = 'CONFIGURACION_NO_ENCONTRADA';

export class ServicioConfiguracion {
  async listar(): Promise<Result<Configuracion[], never>> {
    return Ok(await RepositorioConfiguracion.listarTodas());
  }

  async actualizar(
    clave: string,
    valor: string,
  ): Promise<Result<Configuracion, ErrorConfiguracion>> {
    const config = await RepositorioConfiguracion.buscarPorClave(clave);

    if (!config) {
      return Err('CONFIGURACION_NO_ENCONTRADA');
    }

    config.valor = valor;

    return Ok(await RepositorioConfiguracion.guardar(config));
  }
}
