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

type Props = { valor: number | null; onSeleccionar: (id: number) => void };

type State = {
  habitaciones: Habitacion[];
  tipos: TipoHabitacion[];
  tipoFiltro: number | null;
};

export class SelectorHabitacion extends Component<Props, State> {
  state: State = { habitaciones: [], tipos: [], tipoFiltro: null };

  async componentDidMount() {
    const [resultadoHabitaciones, resultadoTipos] = await Promise.all([
      ApiHabitacion.listarDisponibles(),
      ApiTipoHabitacion.listar(),
    ]);

    if (resultadoHabitaciones.ok) {
      this.setState({ habitaciones: resultadoHabitaciones.val });
    }
    if (resultadoTipos.ok) {
      const tipos = resultadoTipos.val;
      this.setState({
        tipos,
        tipoFiltro: tipos.length > 0 ? Number(tipos[0].id) : null,
      });
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
              {tipo.nombre} — cap. {tipo.capacidad_maxima} — S/.
              {tipo.precio_referencia}
            </option>
          ))}
        </select>
        <select
          className='formulario-reserva__campo'
          value={valor ?? ''}
          onChange={(evento) => onSeleccionar(Number(evento.target.value))}
          required>
          <option value=''>Seleccionar habitación</option>
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
