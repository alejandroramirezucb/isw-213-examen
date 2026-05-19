import { AppDataSource } from '../config/BaseDatos';
import { Configuracion } from '../modelos/Configuracion';

export const RepositorioConfiguracion = AppDataSource.getRepository(
  Configuracion,
).extend({
  listarTodas() {
    return this.find({ order: { clave: 'ASC' } });
  },

  buscarPorClave(clave: string) {
    return this.findOneBy({ clave });
  },

  guardar(config: Configuracion) {
    return this.save(config);
  },

  async obtenerNumero(clave: string, defecto = 0): Promise<number> {
    const config = await this.findOneBy({ clave });
    return config ? parseFloat(config.valor) : defecto;
  },

  async obtenerTexto(clave: string, defecto = ''): Promise<string> {
    const config = await this.findOneBy({ clave });
    return config?.valor ?? defecto;
  },
});
