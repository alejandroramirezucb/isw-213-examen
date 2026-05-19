import { Result } from 'ts-results';
import { ClienteApp } from '../config/ClienteApp';

type Configuracion = {
  clave: string;
  valor: string;
  descripcion: string;
  tipo_dato: string;
};

const ApiConfiguracion = {
  obtener: (): Promise<Result<Configuracion[], string>> =>
    ClienteApp.peticion('/configuracion'),

  actualizar: (
    clave: string,
    valor: string,
  ): Promise<Result<Configuracion, string>> =>
    ClienteApp.peticion(`/configuracion/${clave}`, 'PATCH', { valor }),
};

export default ApiConfiguracion;



