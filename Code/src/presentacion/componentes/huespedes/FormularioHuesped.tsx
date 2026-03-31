import React from 'react';
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

export class FormularioHuesped extends React.Component<Props, State> {
  state: State = {
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    error: null,
    exito: null,
    cargando: false,
  };

  guardar = async (e: React.FormEvent) => {
    e.preventDefault();
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
            onChange={(e) => this.setState({ tipo_documento: e.target.value })}>
            <option value='DNI'>DNI</option>
            <option value='PASAPORTE'>Pasaporte</option>
            <option value='CE'>Carné de extranjería</option>
          </select>
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>
            Número de documento
          </label>
          <input
            className='formulario-huesped__campo'
            value={numero_documento}
            onChange={(e) =>
              this.setState({ numero_documento: e.target.value })
            }
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Nombres</label>
          <input
            className='formulario-huesped__campo'
            value={nombres}
            onChange={(e) => this.setState({ nombres: e.target.value })}
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Apellidos</label>
          <input
            className='formulario-huesped__campo'
            value={apellidos}
            onChange={(e) => this.setState({ apellidos: e.target.value })}
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Correo</label>
          <input
            className='formulario-huesped__campo'
            type='email'
            value={correo}
            onChange={(e) => this.setState({ correo: e.target.value })}
            required
          />
        </div>
        <div className='formulario-huesped__fila'>
          <label className='formulario-huesped__label'>Teléfono</label>
          <input
            className='formulario-huesped__campo'
            value={telefono}
            onChange={(e) => this.setState({ telefono: e.target.value })}
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
