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
  huesped_titular?: { nombres: string; apellidos: string };
};

type Estancia = {
  id: number;
  timestamp_checkin: string;
  reserva?: Reserva;
};

type State = {
  reservas: Reserva[];
  idReserva: number | null;
  estanciaEncontrada: Estancia | null;
  observaciones: string;
  registrado_por: string;
  error: string | null;
  exito: string | null;
  cargando: boolean;
  busqueda: string;
  reservasFiltradas: Reserva[];
  buscandoEstancia: boolean;
};

export class FormularioCheckout extends Component<{}, State> {
  state: State = {
    reservas: [],
    idReserva: null,
    estanciaEncontrada: null,
    observaciones: '',
    registrado_por: '',
    error: null,
    exito: null,
    cargando: true,
    busqueda: '',
    reservasFiltradas: [],
    buscandoEstancia: false,
  };

  async componentDidMount() {
    const resultado = await ApiReserva.listarActivas();

    if (resultado.ok) {
      this.setState({
        reservas: resultado.val,
        reservasFiltradas: resultado.val,
        cargando: false,
      });
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

    const texto = termino.toLowerCase();
    const filtradas = reservas.filter((reserva) =>
      reserva.id.toString().includes(texto),
    );

    this.setState({
      busqueda: termino,
      reservasFiltradas: filtradas,
      error: null,
    });
  };

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
      busqueda,
      reservasFiltradas,
    } = this.state;

    if (cargando && reservas.length === 0) {
      return <Cargando />;
    }

    const reservaSeleccionada = reservas.find((r) => r.id === idReserva);

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
          <label className='formulario-checkout__label'>Buscar reserva</label>
          <input
            className='formulario-checkout__campo'
            type='text'
            placeholder='Por ID'
            value={busqueda}
            onChange={(evento) => this.filtrarReservas(evento.target.value)}
          />
        </div>

        {reservasFiltradas.length > 0 && (
          <div className='formulario-checkout__lista-reservas'>
            <p className='formulario-checkout__lista-titulo'>
              {reservasFiltradas.length} reserva
              {reservasFiltradas.length !== 1 ? 's' : ''} encontrada
              {reservasFiltradas.length !== 1 ? 's' : ''}
            </p>
            <div className='formulario-checkout__lista-items'>
              {reservasFiltradas.map((reserva) => (
                <div
                  key={reserva.id}
                  className={`formulario-checkout__lista-item ${
                    idReserva === reserva.id
                      ? 'formulario-checkout__lista-item--seleccionada'
                      : ''
                  }`}
                  onClick={() => this.setState({ idReserva: reserva.id })}>
                  <div className='formulario-checkout__lista-item-id'>
                    #{reserva.id}
                  </div>
                  <div className='formulario-checkout__lista-item-detalles'>
                    <div className='formulario-checkout__lista-item-habitacion'>
                      Hab. {reserva.habitacion?.numero_habitacion || 'N/A'}
                    </div>
                    <div className='formulario-checkout__lista-item-huesped'>
                      {reserva.huesped_titular?.nombres || ''}{' '}
                      {reserva.huesped_titular?.apellidos || ''}
                    </div>
                    <div className='formulario-checkout__lista-item-fecha'>
                      Check-in: {reserva.fecha_checkin}
                    </div>
                  </div>
                  {idReserva === reserva.id && (
                    <div className='formulario-checkout__lista-item-check'>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {busqueda && reservasFiltradas.length === 0 && (
          <div className='formulario-checkout__sin-resultados'>
            No hay reservas que coincidan con "{busqueda}"
          </div>
        )}

        {reservaSeleccionada && (
          <div className='formulario-checkout__info-reserva'>
            <div className='formulario-checkout__info-item'>
              <span className='formulario-checkout__info-label'>ID:</span>
              <span className='formulario-checkout__info-valor'>
                #{reservaSeleccionada.id}
              </span>
            </div>
            <div className='formulario-checkout__info-item'>
              <span className='formulario-checkout__info-label'>
                Habitación:
              </span>
              <span className='formulario-checkout__info-valor'>
                Hab.{' '}
                {reservaSeleccionada.habitacion?.numero_habitacion || 'N/A'}
              </span>
            </div>
            <div className='formulario-checkout__info-item'>
              <span className='formulario-checkout__info-label'>
                Check-out previsto:
              </span>
              <span className='formulario-checkout__info-valor'>
                {reservaSeleccionada.fecha_checkout}
              </span>
            </div>
          </div>
        )}
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
