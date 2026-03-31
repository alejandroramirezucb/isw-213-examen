import { Component, SyntheticEvent } from 'react';
import './FormularioCheckout.css';
import ApiReserva from '../../apis/ApiReserva';
import ApiEstancia from '../../apis/ApiEstancia';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';
import { Cargando } from '../comunes/Cargando';

type Reserva = {
  id: number;
  fecha_checkin: string;
  fecha_checkout: string;
  estado: string;
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

export class FormularioCheckout extends Component<{}, State> {
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
      const reservasActivas = resultado.val.filter(
        (reserva) => reserva.estado === 'ACTIVA',
      );
      this.setState({ reservas: reservasActivas, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  }

  registrar = async (evento: SyntheticEvent) => {
    evento.preventDefault();
    const { idReserva, observaciones, registrado_por } = this.state;

    if (!idReserva) {
      return;
    }

    this.setState({ cargando: true, error: null, exito: null });
    const resultado = await ApiEstancia.registrarCheckout(idReserva, {
      observaciones: observaciones || undefined,
      registrado_por: registrado_por || undefined,
    });

    if (resultado.ok) {
      this.setState({
        exito: 'Check-out registrado exitosamente',
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
        className='formulario-checkout'
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
        <div className='formulario-checkout__fila'>
          <label className='formulario-checkout__label'>Estancia activa</label>
          <select
            className='formulario-checkout__campo'
            value={idReserva ?? ''}
            onChange={(evento) =>
              this.setState({ idReserva: Number(evento.target.value) })
            }
            required>
            <option value=''>Seleccionar estancia</option>
            {reservas.map((reserva) => (
              <option
                key={reserva.id}
                value={reserva.id}>
                #{reserva.id} —{' '}
                {reserva.habitacion
                  ? `Hab. ${reserva.habitacion.numero_habitacion}`
                  : ''}{' '}
                — {reserva.fecha_checkin}
              </option>
            ))}
          </select>
        </div>
        <div className='formulario-checkout__fila'>
          <label className='formulario-checkout__label'>Registrado por</label>
          <input
            className='formulario-checkout__campo'
            value={registrado_por}
            onChange={(evento) =>
              this.setState({ registrado_por: evento.target.value })
            }
          />
        </div>
        <div className='formulario-checkout__fila'>
          <label className='formulario-checkout__label'>Observaciones</label>
          <textarea
            className='formulario-checkout__campo'
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
          Registrar check-out
        </Boton>
      </form>
    );
  }
}
