import { ILike } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Huesped, TipoDocumento } from '../modelos/Huesped';

export const RepositorioHuesped = AppDataSource.getRepository(Huesped).extend({
  findByDocumento(tipo: TipoDocumento, numero: string) {
    return this.findOneBy({ tipo_documento: tipo, numero_documento: numero });
  },

  findByCorreo(correo_reserva: string) {
    return this.findOneBy({ correo_reserva });
  },

  buscarPorNombres(termino: string) {
    return this.find({
      where: [
        { nombres: ILike(`%${termino}%`) },
        { apellidos: ILike(`%${termino}%`) },
      ],
      order: {
        apellidos: 'ASC',
        nombres: 'ASC',
      },
    });
  },
});
