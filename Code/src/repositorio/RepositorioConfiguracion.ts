import { AppDataSource } from '../data-source';
import { Configuracion, TipoDato } from '../modelos/Configuracion';

export const RepositorioConfiguracion = AppDataSource.getRepository(
  Configuracion,
).extend({
  findByTipo(tipoDato: TipoDato) {
    return this.findBy({ tipo_dato: tipoDato });
  },
});
