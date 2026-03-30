import { Ok, Err, Result } from 'ts-results';
import { RepositorioCancelacion } from '../repositorio/RepositorioCancelacion';
import { Cancelacion } from '../modelos/Cancelacion';

type ErrorCancelacion = 'CANCELACION_NO_ENCONTRADA';

export class ServicioCancelacion {
  async buscarPorReserva(
    idReserva: number,
  ): Promise<Result<Cancelacion, ErrorCancelacion>> {
    const cancelacion = await RepositorioCancelacion.findByReserva(idReserva);

    if (!cancelacion) {
      return Err('CANCELACION_NO_ENCONTRADA');
    }

    return Ok(cancelacion);
  }

  async listarConMora(): Promise<Result<Cancelacion[], never>> {
    return Ok(await RepositorioCancelacion.findConMora());
  }
}
