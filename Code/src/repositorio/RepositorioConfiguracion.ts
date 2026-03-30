import { AppDataSource } from '../config/BaseDatos';
import { Configuracion } from '../modelos/Configuracion';

export const RepositorioConfiguracion = AppDataSource.getRepository(
  Configuracion,
).extend({
  async getNumero(clave: string, defecto = 0): Promise<number> {
    const config = await this.findOneBy({ clave });
    return config ? parseFloat(config.valor) : defecto;
  },

  async getTexto(clave: string, defecto = ''): Promise<string> {
    const config = await this.findOneBy({ clave });
    return config?.valor ?? defecto;
  },
});
