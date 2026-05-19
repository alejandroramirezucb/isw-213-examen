import { Ok, Err, Result } from 'ts-results';
import { RepositorioHabitacion } from '../repositorio/RepositorioHabitacion';
import { RepositorioReserva } from '../repositorio/RepositorioReserva';
import { Habitacion, EstadoHabitacion } from '../modelos/Habitacion';

type ErrorHabitacion =
  | 'HABITACION_NO_ENCONTRADA'
  | 'HABITACION_CON_RESERVA_ACTIVA'
  | 'RANGO_FECHAS_INVALIDO';

export class ServicioHabitacion {
  async listar(): Promise<Result<Habitacion[], never>> {
    return Ok(await RepositorioHabitacion.buscarTodas());
  }

  async buscarPorId(id: number): Promise<Result<Habitacion, ErrorHabitacion>> {
    const habitacion = await RepositorioHabitacion.buscarConTipo(id);

    if (!habitacion) {
      return Err('HABITACION_NO_ENCONTRADA');
    }

    return Ok(habitacion);
  }

  async listarDisponibles(
    fechaCheckin?: string,
    fechaCheckout?: string,
  ): Promise<Result<Habitacion[], ErrorHabitacion>> {
    if (!fechaCheckin && !fechaCheckout) {
      return Ok(await RepositorioHabitacion.buscarDisponibles());
    }

    if (!fechaCheckin || !fechaCheckout) {
      return Err('RANGO_FECHAS_INVALIDO');
    }

    const inicio = new Date(fechaCheckin);
    const fin = new Date(fechaCheckout);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fin.getTime()) ||
      fin <= inicio
    ) {
      return Err('RANGO_FECHAS_INVALIDO');
    }

    return Ok(
      await RepositorioHabitacion.buscarDisponiblesEnRango(
        fechaCheckin,
        fechaCheckout,
      ),
    );
  }

  async listarPorPiso(piso: number): Promise<Result<Habitacion[], never>> {
    return Ok(await RepositorioHabitacion.buscarPorPiso(piso));
  }

  async cambiarEstado(
    id: number,
    estado: EstadoHabitacion,
  ): Promise<Result<void, ErrorHabitacion>> {
    const habitacion = await RepositorioHabitacion.findOneBy({ id });

    if (!habitacion) {
      return Err('HABITACION_NO_ENCONTRADA');
    }

    if (estado === EstadoHabitacion.DISPONIBLE) {
      const tieneActivas = await RepositorioReserva.tieneReservasActivas(id);

      if (tieneActivas) {
        return Err('HABITACION_CON_RESERVA_ACTIVA');
      }
    }

    await RepositorioHabitacion.update(id, { estado });

    return Ok(undefined);
  }
}
