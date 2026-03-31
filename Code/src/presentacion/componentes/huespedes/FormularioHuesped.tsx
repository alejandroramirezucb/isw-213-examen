import { Component, FormEvent } from 'react';
import './FormularioHuesped.css';
import ApiHuesped from '../../apis/ApiHuesped';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';

type Props = { onGuardado?: () => void };

type State = {
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  error: string | null;
  exito: string | null;
  cargando: boolean;
};

export class FormularioHuesped extends Component<Props, State> {
  state: State = {
    tipo_documento: 'carnet',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    error: null,
    exito: null,
    cargando: false,
  };

  guardar = async (evento: FormEvent) => {
    evento.preventDefault();

    const {
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      correo,
      telefono,
    } = this.state;

    this.setState({ cargando: true, error: null, exito: null });

    const resultado = await ApiHuesped.registrar({
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      correo,
      telefono: telefono || undefined,
    });

    if (resultado.ok) {
      this.setState({
        exito: 'Huésped registrado correctamente',
        cargando: false,
      });

      if (this.props.onGuardado) {
        this.props.onGuardado();
      }
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  };

  render() {
    const {
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      correo,
      telefono,
      error,
      exito,
      cargando,
    } = this.state;
    return (
      <form
        className='formulario-huesped'
        onSubmit={this.guardar}>
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
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Tipo de documento</label>
          <select
            className='formulario-huesped__campo'
            value={tipo_documento}
            onChange={(evento) =>
              this.setState({ tipo_documento: evento.target.value })
            }>
            <option value='carnet'>Carné</option>
            <option value='pasaporte'>Pasaporte</option>
            <option value='carnet_extranjero'>Carné de extranjería</option>
            <option value='nit'>NIT</option>
          </select>
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>
            Número de documento
          </label>
          <input
            className='formulario-huesped__campo'
            value={numero_documento}
            onChange={(evento) =>
              this.setState({ numero_documento: evento.target.value })
            }
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Nombres</label>
          <input
            className='formulario-huesped__campo'
            value={nombres}
            onChange={(evento) =>
              this.setState({ nombres: evento.target.value })
            }
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Apellidos</label>
          <input
            className='formulario-huesped__campo'
            value={apellidos}
            onChange={(evento) =>
              this.setState({ apellidos: evento.target.value })
            }
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Correo</label>
          <input
            className='formulario-huesped__campo'
            type='email'
            value={correo}
            onChange={(evento) =>
              this.setState({ correo: evento.target.value })
            }
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Teléfono</label>
          <input
            className='formulario-huesped__campo'
            value={telefono}
            onChange={(evento) =>
              this.setState({ telefono: evento.target.value })
            }
          />
        </div>
        <Boton
          type='submit'
          disabled={cargando}>
          Registrar huésped
        </Boton>
      </form>
    );
  }
}
