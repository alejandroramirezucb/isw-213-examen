import { Component, SyntheticEvent } from 'react';
import './Configuracion.css';
import ApiConfiguracion from '../../apis/ApiConfiguracion';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';
import { Cargando } from '../comunes/Cargando';
import { decodificarTexto } from '../../utiles/DecodificarTexto';

type ConfigItem = {
  clave: string;
  valor: string;
  descripcion: string;
  tipo_dato: string;
};

type State = {
  configuraciones: ConfigItem[];
  cambios: { [clave: string]: string };
  error: string | null;
  exito: string | null;
  cargando: boolean;
  guardando: boolean;
};

export class Configuracion extends Component<{}, State> {
  state: State = {
    configuraciones: [],
    cambios: {},
    error: null,
    exito: null,
    cargando: true,
    guardando: false,
  };

  async componentDidMount() {
    const resultado = await ApiConfiguracion.obtener();
    if (resultado.ok) {
      this.setState({ configuraciones: resultado.val, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  }

  manejarCambio = (clave: string, valor: string) => {
    this.setState((prev) => ({
      cambios: { ...prev.cambios, [clave]: valor },
    }));
  };

  guardar = async (evento: SyntheticEvent) => {
    evento.preventDefault();
    const { cambios } = this.state;

    if (Object.keys(cambios).length === 0) {
      this.setState({ error: 'No hay cambios para guardar' });
      return;
    }

    this.setState({ guardando: true, error: null, exito: null });

    const promesas = Object.entries(cambios).map(([clave, valor]) =>
      ApiConfiguracion.actualizar(clave, valor),
    );

    const resultados = await Promise.all(promesas);
    const conError = resultados.some((r) => !r.ok);

    if (conError) {
      const errores = resultados
        .filter((r) => !r.ok)
        .map((r) => (r as any).val)
        .join(', ');
      this.setState({
        error: `Error al guardar: ${errores}`,
        guardando: false,
      });
    } else {
      const nuevasConfiguraciones = resultados.map((r) => (r as any).val);
      this.setState((prev) => ({
        configuraciones: prev.configuraciones.map(
          (c) => nuevasConfiguraciones.find((nc) => nc.clave === c.clave) || c,
        ),
        cambios: {},
        exito: 'Configuración actualizada exitosamente',
        guardando: false,
      }));
    }
  };

  render() {
    const { configuraciones, cambios, error, exito, cargando, guardando } =
      this.state;

    if (cargando) {
      return <Cargando />;
    }

    return (
      <div className='configuracion'>
        <div className='configuracion__encabezado'>
          <h1 className='configuracion__titulo'>Configuración Global</h1>
          <p className='configuracion__subtitulo'>
            Parámetros operativos del hotel
          </p>
        </div>

        {error && (
          <Alerta
            tipo='error'
            mensaje={error}
          />
        )}
        {exito && (
          <Alerta
            tipo='exito'
            mensaje={exito}
          />
        )}

        <form
          className='configuracion__form'
          onSubmit={this.guardar}>
          <div className='configuracion__grid'>
            {configuraciones.map((config) => {
              const valor = cambios[config.clave] ?? config.valor;

              return (
                <div
                  key={config.clave}
                  className='configuracion__item'>
                  <div className='configuracion__item-header'>
                    <label className='configuracion__label'>
                      {config.clave.replace(/_/g, ' ')}
                    </label>
                  </div>

                  {config.tipo_dato === 'boolean' ? (
                    <select
                      className='configuracion__campo'
                      value={valor.toLowerCase() === 'true' ? 'true' : 'false'}
                      onChange={(e) =>
                        this.manejarCambio(config.clave, e.target.value)
                      }>
                      <option value='true'>Sí</option>
                      <option value='false'>No</option>
                    </select>
                  ) : config.tipo_dato === 'time' ? (
                    <input
                      type='time'
                      className='configuracion__campo'
                      value={valor}
                      onChange={(e) =>
                        this.manejarCambio(config.clave, e.target.value)
                      }
                    />
                  ) : config.tipo_dato === 'numeric' ||
                    config.tipo_dato === 'integer' ? (
                    <input
                      type='number'
                      className='configuracion__campo'
                      step={config.tipo_dato === 'numeric' ? '0.01' : '1'}
                      value={valor}
                      onChange={(e) =>
                        this.manejarCambio(config.clave, e.target.value)
                      }
                    />
                  ) : (
                    <input
                      type='text'
                      className='configuracion__campo'
                      value={valor}
                      onChange={(e) =>
                        this.manejarCambio(config.clave, e.target.value)
                      }
                    />
                  )}

                  {config.descripcion && (
                    <p className='configuracion__descripcion'>
                      {decodificarTexto(config.descripcion)}
                    </p>
                  )}

                  {cambios[config.clave] !== undefined &&
                    cambios[config.clave] !== config.valor && (
                      <div className='configuracion__cambio-indicador'>
                        Cambio pendiente
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {Object.keys(cambios).length > 0 && (
            <div className='configuracion__acciones'>
              <Boton
                type='submit'
                disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </Boton>
              <Boton
                type='button'
                variante='secundario'
                onClick={() => this.setState({ cambios: {} })}
                disabled={guardando}>
                Descartar
              </Boton>
            </div>
          )}
        </form>
      </div>
    );
  }
}
