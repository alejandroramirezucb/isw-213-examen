import { Ok, Err, Result } from 'ts-results';
import { RepositorioHuesped } from '../repositorio/RepositorioHuesped';
import { Huesped, TipoDocumento } from '../modelos/Huesped';
import { CrearHuespedDTO } from '../dtos/Huesped/CrearHuespedDTO';
import { ActualizarHuespedDTO } from '../dtos/Huesped/ActualizarHuespedDTO';

type ErrorHuesped = 'HUESPED_NO_ENCONTRADO' | 'DOCUMENTO_YA_REGISTRADO';

export class ServicioHuesped {
  async registrar(
    dto: CrearHuespedDTO,
  ): Promise<Result<Huesped, ErrorHuesped>> {
    const existe = await RepositorioHuesped.findByDocumento(
      dto.tipo_documento,
      dto.numero_documento,
    );

    if (existe) {
      return Err('DOCUMENTO_YA_REGISTRADO');
    }

    const huesped = RepositorioHuesped.create({
      tipo_documento: dto.tipo_documento,
      numero_documento: dto.numero_documento,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      correo_reserva: dto.correo,
      telefono: dto.telefono ?? null,
    });

    return Ok(await RepositorioHuesped.save(huesped));
  }

  async buscarPorId(id: number): Promise<Result<Huesped, ErrorHuesped>> {
    const huesped = await RepositorioHuesped.findOneBy({ id });

    if (!huesped) {
      return Err('HUESPED_NO_ENCONTRADO');
    }

    return Ok(huesped);
  }

  async buscarPorDocumento(
    tipo: TipoDocumento,
    numero: string,
  ): Promise<Result<Huesped, ErrorHuesped>> {
    const huesped = await RepositorioHuesped.findByDocumento(tipo, numero);

    if (!huesped) {
      return Err('HUESPED_NO_ENCONTRADO');
    }

    return Ok(huesped);
  }

  async buscarPorNombres(termino: string): Promise<Result<Huesped[], never>> {
    return Ok(await RepositorioHuesped.FindByNombres(termino));
  }

  async listar(): Promise<Result<Huesped[], never>> {
    return Ok(
      await RepositorioHuesped.find({
        order: { apellidos: 'ASC', nombres: 'ASC' },
      }),
    );
  }

  async actualizar(
    id: number,
    dto: ActualizarHuespedDTO,
  ): Promise<Result<void, ErrorHuesped>> {
    const { affected } = await RepositorioHuesped.update(id, dto);

    if (!affected) {
      return Err('HUESPED_NO_ENCONTRADO');
    }

    return Ok(undefined);
  }
}
