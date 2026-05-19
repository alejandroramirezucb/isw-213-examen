import { Ok, Err, Result } from 'ts-results';
import { RepositorioReserva } from '../repositorio/RepositorioReserva';
import { RepositorioHabitacion } from '../repositorio/RepositorioHabitacion';
import { RepositorioCancelacion } from '../repositorio/RepositorioCancelacion';
import { RepositorioReservaHuesped } from '../repositorio/RepositorioReservaHuesped';
import { Reserva, EstadoReserva } from '../modelos/Reserva';
import { CrearReservaDTO } from '../dtos/Reserva/CrearReservaDTO';
import { CancelarReservaDTO } from '../dtos/Reserva/CancelarReservaDTO';

type ErrorReserva =
  | 'RESERVA_NO_ENCONTRADA'
  | 'HABITACION_NO_ENCONTRADA'
  | 'HABITACION_NO_DISPONIBLE'
  | 'CAPACIDAD_EXCEDIDA'
  | 'YA_CANCELADA';

export class ServicioReserva {
  async crear(dto: CrearReservaDTO): Promise<Result<Reserva, ErrorReserva>> {
    const habitacion = await RepositorioHabitacion.buscarConTipo(
      dto.id_habitacion,
    );

    if (!habitacion) {
      return Err('HABITACION_NO_ENCONTRADA');
    }
    if (dto.cantidad_personas > habitacion.tipo_habitacion.capacidad_maxima) {
      return Err('CAPACIDAD_EXCEDIDA');
    }

    const hayConflicto = await RepositorioReserva.tieneConflictoFechas(
      dto.id_habitacion,
      new Date(dto.fecha_checkin),
      new Date(dto.fecha_checkout),
    );

    if (hayConflicto) {
      return Err('HABITACION_NO_DISPONIBLE');
    }

    const nuevaReserva = new Reserva();
    nuevaReserva.habitacion = { id: dto.id_habitacion } as any;
    nuevaReserva.fecha_checkin = dto.fecha_checkin;
    nuevaReserva.fecha_checkout = dto.fecha_checkout;
    nuevaReserva.cantidad_personas = dto.cantidad_personas;
    nuevaReserva.estado = EstadoReserva.PENDIENTE;
    nuevaReserva.notas = dto.notas ?? null;

    const reserva = await RepositorioReserva.save(nuevaReserva);

    const titular = RepositorioReservaHuesped.create({
      id_reserva: reserva.id,
      id_huesped: dto.id_huesped_titular,
      es_titular: true,
    });

    await RepositorioReservaHuesped.save(titular);

    return Ok(reserva);
  }

  async cancelar(
    id: number,
    dto: CancelarReservaDTO,
  ): Promise<Result<void, ErrorReserva>> {
    const reserva = await RepositorioReserva.findOneBy({ id });

    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }
    if (reserva.estado === EstadoReserva.CANCELADA) {
      return Err('YA_CANCELADA');
    }

    const cancelacion = RepositorioCancelacion.create({
      reserva: { id },
      motivo: dto.motivo ?? null,
      registrado_por: dto.registrado_por ?? null,
    });

    await RepositorioCancelacion.save(cancelacion);
    await RepositorioReserva.update(id, { estado: EstadoReserva.CANCELADA });

    return Ok(undefined);
  }

  async buscarPorId(id: number): Promise<Result<Reserva, ErrorReserva>> {
    const reserva = await RepositorioReserva.buscarConHabitacion(id);

    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }

    return Ok(reserva);
  }

  async buscarConHuespedes(id: number): Promise<Result<Reserva, ErrorReserva>> {
    const reserva = await RepositorioReserva.buscarConHuespedes(id);

    if (!reserva) {
      return Err('RESERVA_NO_ENCONTRADA');
    }

    return Ok(reserva);
  }

  async listarActivas(): Promise<Result<Reserva[], never>> {
    return Ok(await RepositorioReserva.buscarActivas());
  }
}
