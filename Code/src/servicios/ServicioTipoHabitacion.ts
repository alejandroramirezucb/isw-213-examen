import { Ok, Err, Result } from 'ts-results';
import { RepositorioTipoHabitacion } from '../repositorio/RepositorioTipoHabitacion';
import { TiposHabitacion } from '../modelos/TiposHabitacion';
import { CrearTipoHabitacionDTO } from '../dtos/TiposHabitacion/CrearTipoHabitacionDTO';
import { ActualizarTipoHabitacionDTO } from '../dtos/TiposHabitacion/ActualizarTipoHabitacionDTO';

type ErrorTipoHabitacion =
  | 'TIPO_HABITACION_NO_ENCONTRADO'
  | 'NOMBRE_YA_REGISTRADO';

export class ServicioTipoHabitacion {
  async listar(): Promise<Result<TiposHabitacion[], never>> {
    return Ok(await RepositorioTipoHabitacion.findTodas());
  }

  async buscarPorId(
    id: number,
  ): Promise<Result<TiposHabitacion, ErrorTipoHabitacion>> {
    const tipo = await RepositorioTipoHabitacion.findOneBy({ id });
   
    if (!tipo) {
      return Err('TIPO_HABITACION_NO_ENCONTRADO');
    }

    return Ok(tipo);
  }

  async crear(
    dto: CrearTipoHabitacionDTO,
  ): Promise<Result<TiposHabitacion, ErrorTipoHabitacion>> {
    const existe = await RepositorioTipoHabitacion.findByNombre(dto.nombre);
    
    if (existe) {
      return Err('NOMBRE_YA_REGISTRADO');
    }

    const tipo = RepositorioTipoHabitacion.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      capacidad_maxima: dto.capacidad_maxima,
      precio_referencia: dto.precio_referencia,
    });

    return Ok(await RepositorioTipoHabitacion.save(tipo));
  }

  async actualizar(
    id: number,
    dto: ActualizarTipoHabitacionDTO,
  ): Promise<Result<void, ErrorTipoHabitacion>> {
    const { affected } = await RepositorioTipoHabitacion.update(id, dto);
    
    if (!affected) {
      return Err('TIPO_HABITACION_NO_ENCONTRADO');
    }
    
    return Ok(undefined);
  }
}
