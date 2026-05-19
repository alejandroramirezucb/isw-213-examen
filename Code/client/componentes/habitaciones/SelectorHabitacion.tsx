import { Component } from 'react';
import ApiHabitacion from '../../apis/ApiHabitacion';
import ApiTipoHabitacion from '../../apis/ApiTipoHabitacion';

type TipoHabitacion = {
  id: number;
  nombre: string;
  capacidad_maxima: number;
  precio_referencia: number;
};

type Habitacion = {
  id: number;
  numero_habitacion: string;
  piso: number;
  estado: string;
  tipo_habitacion?: TipoHabitacion;
};

type Props = {
  valor: number | null;
  checkin: string;
  checkout: string;
  onSeleccionar: (id: number | null, habitacion?: Habitacion) => void;
};

type State = {
  habitaciones: Habitacion[];
  tipos: TipoHabitacion[];
  tipoFiltro: number | null;
};

export class SelectorHabitacion extends Component<Props, State> {
  state: State = { habitaciones: [], tipos: [], tipoFiltro: null };

  private tieneRangoFechasValido = () => {
    const { checkin, checkout } = this.props;
    return Boolean(checkin && checkout);
  };

  async componentDidMount() {
    const resultadoTipos = await ApiTipoHabitacion.listar();

    if (this.tieneRangoFechasValido()) {
      const resultadoHabitaciones = await ApiHabitacion.listarDisponibles(
        this.props.checkin || undefined,
        this.props.checkout || undefined,
      );

      if (resultadoHabitaciones.ok) {
        this.setState({ habitaciones: resultadoHabitaciones.val });
      }
    } else {
      this.setState({ habitaciones: [] });
    }

    if (resultadoTipos.ok) {
      const tipos = resultadoTipos.val;
      this.setState({
        tipos,
        tipoFiltro: tipos.length > 0 ? Number(tipos[0].id) : null,
      });
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (
      prevProps.checkin !== this.props.checkin ||
      prevProps.checkout !== this.props.checkout
    ) {
      if (!this.tieneRangoFechasValido()) {
        this.setState({ habitaciones: [] });
        if (this.props.valor) {
          this.props.onSeleccionar(null);
        }
        return;
      }

      const resultadoHabitaciones = await ApiHabitacion.listarDisponibles(
        this.props.checkin || undefined,
        this.props.checkout || undefined,
      );

      if (resultadoHabitaciones.ok) {
        const habitaciones = resultadoHabitaciones.val;
        this.setState({ habitaciones });

        if (
          this.props.valor &&
          !habitaciones.some((habitacion) => habitacion.id === this.props.valor)
        ) {
          this.props.onSeleccionar(null);
        }
      }
    }
  }

  render() {
    const { habitaciones, tipos, tipoFiltro } = this.state;
    const { onSeleccionar, valor } = this.props;
    const filtradas = tipoFiltro
      ? habitaciones.filter(
          (habitacion) =>
            habitacion.tipo_habitacion &&
            Number(habitacion.tipo_habitacion.id) === tipoFiltro,
        )
      : habitaciones;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <select
          className='formulario-reserva__campo'
          value={tipoFiltro ?? ''}
          onChange={(evento) =>
            this.setState({
              tipoFiltro: evento.target.value
                ? Number(evento.target.value)
                : null,
            })
          }>
          {tipos.map((tipo) => (
            <option
              key={tipo.id}
              value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <select
          className='formulario-reserva__campo'
          value={valor ?? ''}
          onChange={(evento) => {
            if (!evento.target.value) {
              onSeleccionar(null);
              return;
            }

            const id = Number(evento.target.value);
            const hab = filtradas.find((h) => h.id === id);
            onSeleccionar(id, hab);
          }}
          required>
          <option value=''>
            {this.tieneRangoFechasValido()
              ? 'Seleccionar habitación'
              : 'Primero selecciona check-in y check-out'}
          </option>
          {filtradas.map((habitacion) => (
            <option
              key={habitacion.id}
              value={habitacion.id}>
              Hab. {habitacion.numero_habitacion} — Piso {habitacion.piso}
              {habitacion.tipo_habitacion
                ? ` (${habitacion.tipo_habitacion.nombre})`
                : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }
}




