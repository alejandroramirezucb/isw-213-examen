import { Ok, Err, Result } from 'ts-results';
import { RepositorioEstancia } from '../repositorio/RepositorioEstancia';
import { RepositorioReserva } from '../repositorio/RepositorioReserva';
import { RepositorioConfiguracion } from '../repositorio/RepositorioConfiguracion';
import { Estancia } from '../modelos/Estancia';
import { EstadoReserva } from '../modelos/Reserva';
import { RegistrarCheckinDTO } from '../dtos/Estancia/RegistrarCheckinDTO';
import { RegistrarCheckoutDTO } from '../dtos/Estancia/RegistrarCheckoutDTO';

type ErrorEstancia =
  | 'RESERVA_NO_ENCONTRADA'
  | 'ESTADO_INVALIDO'
  | 'CHECKIN_YA_REGISTRADO'
  | 'ESTANCIA_NO_ENCONTRADA'
  | 'CHECKOUT_YA_REGISTRADO';

export class ServicioEstancia {
  private async esSalidaTardia(): Promise<boolean> {
    const horaLimite = await RepositorioConfiguracion.getTexto(
      'late_checkout_hora_limite',
      '12:00',
    );
    const [hora, minutos] = horaLimite.split(':').map(Number);
    const ahora = new Date();

    return (
      ahora.getHours() > hora ||
      (ahora.getHours() === hora && ahora.getMinutes() > minutos)
    );
  }

  async registrarCheckin(
    idReserva: number,
    dto: RegistrarCheckinDTO,
  ): Promise<Result<Estancia, ErrorEstancia>> {
    const reserva = await RepositorioReserva.findOneBy({ id: idReserva });

    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }
    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      return Err('ESTADO_INVALIDO');
    }

    const existe = await RepositorioEstancia.findByReserva(idReserva);

    if (existe) {
      return Err('CHECKIN_YA_REGISTRADO');
    }

    const nuevaEstancia = RepositorioEstancia.create({
      reserva: { id: idReserva },
      registrado_checkin_por: dto.registrado_por ?? null,
      observaciones_checkin: dto.observaciones ?? null,
    });

    const estancia = await RepositorioEstancia.save(nuevaEstancia);

    await RepositorioReserva.update(idReserva, {
      estado: EstadoReserva.ACTIVA,
    });

    return Ok(estancia);
  }

  async registrarCheckout(
    idReserva: number,
    dto: RegistrarCheckoutDTO,
  ): Promise<Result<void, ErrorEstancia>> {
    const estancia = await RepositorioEstancia.findByReserva(idReserva);

    if (!estancia) {
      return Err('ESTANCIA_NO_ENCONTRADA');
    }
    if (estancia.timestamp_checkout) {
      return Err('CHECKOUT_YA_REGISTRADO');
    }

    const esTardia = await this.esSalidaTardia();

    await RepositorioEstancia.update(estancia.id, {
      timestamp_checkout: new Date(),
      es_late_checkout: esTardia,
      registrado_checkout_por: dto.registrado_por ?? null,
      observaciones_checkout: dto.observaciones ?? null,
    });

    await RepositorioReserva.update(idReserva, {
      estado: EstadoReserva.COMPLETADA,
    });

    return Ok(undefined);
  }

  async buscarPorReserva(
    idReserva: number,
  ): Promise<Result<Estancia, ErrorEstancia>> {
    const estancia = await RepositorioEstancia.findByReserva(idReserva);

    if (!estancia) {
      return Err('ESTANCIA_NO_ENCONTRADA');
    }

    return Ok(estancia);
  }

  async listarAbiertas(): Promise<Result<Estancia[], never>> {
    return Ok(await RepositorioEstancia.findAbiertas());
  }
}
