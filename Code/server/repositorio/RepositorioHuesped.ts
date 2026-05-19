import { ILike } from 'typeorm';
import { AppDataSource } from '../config/BaseDatos';
import { Huesped, TipoDocumento } from '../modelos/Huesped';

export const RepositorioHuesped = AppDataSource.getRepository(Huesped).extend({
  buscarPorDocumento(tipo: TipoDocumento, numero: string) {
    return this.findOneBy({ tipo_documento: tipo, numero_documento: numero });
  },

  buscarPorCorreo(correo_reserva: string) {
    return this.findOneBy({ correo_reserva });
  },

  buscarPorNombres(termino: string) {
    return this.find({
      where: [
        { nombres: ILike(`%${termino}%`) },
        { apellidos: ILike(`%${termino}%`) },
      ],
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
  },

  buscarTodas() {
    return this.find({ order: { apellidos: 'ASC', nombres: 'ASC' } });
  },
});
