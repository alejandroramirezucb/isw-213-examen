import { Ok, Err, Result } from 'ts-results';
import { RepositorioContactoServicio } from '../repositorio/RepositorioContactoServicio';
import { ContactoServicio } from '../modelos/ContactoServicio';

type ErrorContactoServicio = 'SERVICIO_NO_ENCONTRADO';

export class ServicioContactoServicio {
  async listarActivos(): Promise<Result<ContactoServicio[], never>> {
    return Ok(await RepositorioContactoServicio.buscarActivos());
  }

  async buscarPorNombre(
    nombre: string,
  ): Promise<Result<ContactoServicio, ErrorContactoServicio>> {
    const contactoServicio =
      await RepositorioContactoServicio.buscarPorNombre(nombre);

    if (!contactoServicio) {
      return Err('SERVICIO_NO_ENCONTRADO');
    }

    return Ok(contactoServicio);
  }
}
