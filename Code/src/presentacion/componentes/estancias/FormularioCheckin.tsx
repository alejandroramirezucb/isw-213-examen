import { Component, SyntheticEvent } from 'react';
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
  huesped_titular?: { nombres: string; apellidos: string };
};

type State = {
  reservas: Reserva[];
  idReserva: number | null;
  observaciones: string;
  registrado_por: string;
  error: string | null;
  exito: string | null;
  cargando: boolean;
  busqueda: string;
  reservasFiltradas: Reserva[];
};

export class FormularioCheckin extends Component<{}, State> {
  state: State = {
    reservas: [],
    idReserva: null,
    observaciones: '',
    registrado_por: '',
    error: null,
    exito: null,
    cargando: true,
    busqueda: '',
    reservasFiltradas: [],
  };

  async componentDidMount() {
    const resultado = await ApiReserva.listarActivas();
    if (resultado.ok) {
      this.setState({ reservas: resultado.val, reservasFiltradas: resultado.val, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  }

  filtrarReservas = (termino: string) => {
    const { reservas } = this.state;
    if (!termino.trim()) {
      this.setState({ busqueda: termino, reservasFiltradas: reservas });
      return;
    }

    const filtradas = reservas.filter((r) => {
      const id = r.id.toString();
      const habitacion = r.habitacion?.numero_habitacion || '';
      const titular = `${r.huesped_titular?.nombres || ''} ${r.huesped_titular?.apellidos || ''}`.toLowerCase();
      const termLower = termino.toLowerCase();

      return (
        id.includes(termino) ||
        habitacion.includes(termLower) ||
        titular.includes(termLower)
      );
    });

    this.setState({ busqueda: termino, reservasFiltradas: filtradas });
  };

  registrar = async (evento: SyntheticEvent) => {
    evento.preventDefault();
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
      busqueda,
      reservasFiltradas,
    } = this.state;
    if (cargando && reservas.length === 0) {
      return <Cargando />;
    }

    const reservaSeleccionada = reservas.find((r) => r.id === idReserva);

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
          <label className='formulario-checkin__label'>Buscar reserva</label>
          <input
            className='formulario-checkin__campo'
            type='text'
            placeholder='Por ID, habitación o nombre del huésped'
            value={busqueda}
            onChange={(evento) => this.filtrarReservas(evento.target.value)}
          />
        </div>

        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Seleccionar reserva</label>
          <select
            className='formulario-checkin__campo'
            value={idReserva ?? ''}
            onChange={(evento) =>
              this.setState({ idReserva: Number(evento.target.value) })
            }
            required>
            <option value=''>Seleccionar reserva</option>
            {reservasFiltradas.map((reserva) => (
              <option
                key={reserva.id}
                value={reserva.id}>
                #{reserva.id} — Hab. {reserva.habitacion?.numero_habitacion || 'N/A'} — {reserva.huesped_titular?.nombres || ''} {reserva.huesped_titular?.apellidos || ''} — {reserva.fecha_checkin}
              </option>
            ))}
          </select>
        </div>

        {reservaSeleccionada && (
          <div className='formulario-checkin__info-reserva'>
            <div className='formulario-checkin__info-item'>
              <span className='formulario-checkin__info-label'>ID:</span>
              <span className='formulario-checkin__info-valor'>#{reservaSeleccionada.id}</span>
            </div>
            <div className='formulario-checkin__info-item'>
              <span className='formulario-checkin__info-label'>Habitación:</span>
              <span className='formulario-checkin__info-valor'>Hab. {reservaSeleccionada.habitacion?.numero_habitacion || 'N/A'}</span>
            </div>
            <div className='formulario-checkin__info-item'>
              <span className='formulario-checkin__info-label'>Check-in:</span>
              <span className='formulario-checkin__info-valor'>{reservaSeleccionada.fecha_checkin}</span>
            </div>
          </div>
        )}
        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Registrado por</label>
          <input
            className='formulario-checkin__campo'
            value={registrado_por}
            onChange={(evento) =>
              this.setState({ registrado_por: evento.target.value })
            }
          />
        </div>
        <div className='formulario-checkin__fila'>
          <label className='formulario-checkin__label'>Observaciones</label>
          <textarea
            className='formulario-checkin__campo'
            value={observaciones}
            onChange={(evento) =>
              this.setState({ observaciones: evento.target.value })
            }
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
