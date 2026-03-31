import React from 'react';
import './FormularioCheckin.css';
import ApiReserva from '../../apis/ApiReserva';
import ApiEstancia from '../../apis/ApiEstancia';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';
import { Cargando } from '../comunes/Cargando';

type Reserva = {
  id: number;
  fecha_checkin: string;
  fecha_checkout: string;
  habitacion?: { id: number; numero_habitacion: string };
};

type State = {
  reservas: Reserva[];
  idReserva: number | null;
  observaciones: string;
  registrado_por: string;
  error: string | null;
  exito: string | null;
  cargando: boolean;
};

export class FormularioCheckin extends React.Component<{}, State> {
  state: State = {
    reservas: [],
    idReserva: null,
    observaciones: '',
    registrado_por: '',
    error: null,
    exito: null,
    cargando: true,
  };

  async componentDidMount() {
    const resultado = await ApiReserva.listarActivas();
    if (resultado.ok) {
      this.setState({ reservas: resultado.val, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  }

  registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const { idReserva, observaciones, registrado_por } = this.state;
    if (!idReserva) {
      return;
    }
    this.setState({ cargando: true, error: null, exito: null });
    const resultado = await ApiEstancia.registrarCheckin(idReserva, {
      observaciones: observaciones || undefined,
      registrado_por: registrado_por || undefined,
    });
    if (resultado.ok) {
      this.setState({
        exito: 'Check-in registrado exitosamente',
        cargando: false,
        idReserva: null,
      });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  };

  render() {
    const {
      reservas,
      idReserva,
      observaciones,
      registrado_por,
      error,
      exito,
      cargando,
    } = this.state;
    if (cargando && reservas.length === 0) {
      return <Cargando />;
    }
    return (
      <form
        className='formulario-checkin'
        onSubmit={this.registrar}>
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
        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Reserva</label>
          <select
            className='formulario-checkin__campo'
            value={idReserva ?? ''}
            onChange={(e) =>
              this.setState({ idReserva: Number(e.target.value) })
            }
            required>
            <option value=''>Seleccionar reserva</option>
            {reservas.map((r) => (
              <option
                key={r.id}
                value={r.id}>
                #{r.id} —{' '}
                {r.habitacion ? `Hab. ${r.habitacion.numero_habitacion}` : ''} —{' '}
                {r.fecha_checkin}
              </option>
            ))}
          </select>
        </div>
        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Registrado por</label>
          <input
            className='formulario-checkin__campo'
            value={registrado_por}
            onChange={(e) => this.setState({ registrado_por: e.target.value })}
          />
        </div>
        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Observaciones</label>
          <textarea
            className='formulario-checkin__campo'
            value={observaciones}
            onChange={(e) => this.setState({ observaciones: e.target.value })}
            rows={3}
          />
        </div>
        <Boton
          type='submit'
          disabled={cargando}>
          Registrar check-in
        </Boton>
      </form>
    );
  }
}
