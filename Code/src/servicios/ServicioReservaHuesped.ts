import { Ok, Err, Result } from 'ts-results';
import { RepositorioReservaHuesped } from '../repositorio/RepositorioReservaHuesped';
import { RepositorioReserva } from '../repositorio/RepositorioReserva';
import { ReservaHuesped } from '../modelos/ReservaHuesped';

type ErrorReservaHuesped =
  | 'RESERVA_NO_ENCONTRADA'
  | 'HUESPED_YA_EN_RESERVA'
  | 'HUESPED_NO_EN_RESERVA'
  | 'NO_SE_PUEDE_QUITAR_TITULAR';

export class ServicioReservaHuesped {
  async listarPorReserva(
    idReserva: number,
  ): Promise<Result<ReservaHuesped[], ErrorReservaHuesped>> {
    const reserva = await RepositorioReserva.findOneBy({ id: idReserva });
    
    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }
    
    return Ok(await RepositorioReservaHuesped.findByReserva(idReserva));
  }

  async agregarHuesped(
    idReserva: number,
    idHuesped: number,
  ): Promise<Result<ReservaHuesped, ErrorReservaHuesped>> {
    const reserva = await RepositorioReserva.findOneBy({ id: idReserva });
    
    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }

    const existe = await RepositorioReservaHuesped.findPorPareja(
      idReserva,
      idHuesped,
    );
    
    if (existe) {
      return Err('HUESPED_YA_EN_RESERVA');
    }

    const entrada = RepositorioReservaHuesped.create({
      id_reserva: idReserva,
      id_huesped: idHuesped,
      es_titular: false,
    });

    return Ok(await RepositorioReservaHuesped.save(entrada));
  }

  async quitarHuesped(
    idReserva: number,
    idHuesped: number,
  ): Promise<Result<void, ErrorReservaHuesped>> {
    const entrada = await RepositorioReservaHuesped.findPorPareja(
      idReserva,
      idHuesped,
    );

    if (!entrada) {
      return Err('HUESPED_NO_EN_RESERVA');
    }
    if (entrada.es_titular) {
      return Err('NO_SE_PUEDE_QUITAR_TITULAR');
    }

    await RepositorioReservaHuesped.delete({
      id_reserva: idReserva,
      id_huesped: idHuesped,
    });
    
    return Ok(undefined);
  }

  async cambiarTitular(
    idReserva: number,
    idHuespedNuevo: number,
  ): Promise<Result<void, ErrorReservaHuesped>> {
    const reserva = await RepositorioReserva.findOneBy({ id: idReserva });
    
    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }

    const nuevo = await RepositorioReservaHuesped.findPorPareja(
      idReserva,
      idHuespedNuevo,
    );
    
    if (!nuevo) {
      return Err('HUESPED_NO_EN_RESERVA');
    }

    await RepositorioReservaHuesped.clearTitular(idReserva);
    await RepositorioReservaHuesped.assignTitular(idReserva, idHuespedNuevo);
   
    return Ok(undefined);
  }
}
