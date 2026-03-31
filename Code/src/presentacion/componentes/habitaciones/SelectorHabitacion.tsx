import React from 'react';
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

export class SelectorHabitacion extends React.Component<Props, State> {
  state: State = { habitaciones: [], tipos: [], tipoFiltro: null };

  async componentDidMount() {
    const [habResult, tipoResult] = await Promise.all([
      ApiHabitacion.listarDisponibles(),
      ApiTipoHabitacion.listar(),
    ]);
    if (habResult.ok) {
      this.setState({ habitaciones: habResult.val });
    }
    if (tipoResult.ok) {
      this.setState({ tipos: tipoResult.val });
    }
  }

  render() {
    const { habitaciones, tipos, tipoFiltro } = this.state;
    const { onSeleccionar, valor } = this.props;
    const filtradas = tipoFiltro
      ? habitaciones.filter(
          (h) => h.tipo_habitacion && h.tipo_habitacion.id === tipoFiltro,
        )
      : habitaciones;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <select
          className='formulario-reserva__campo'
          value={tipoFiltro ?? ''}
          onChange={(e) =>
            this.setState({
              tipoFiltro: e.target.value ? Number(e.target.value) : null,
            })
          }>
          <option value=''>Todos los tipos</option>
          {tipos.map((t) => (
            <option
              key={t.id}
              value={t.id}>
              {t.nombre} — cap. {t.capacidad_maxima} — S/.{t.precio_referencia}
            </option>
          ))}
        </select>
        <select
          className='formulario-reserva__campo'
          value={valor ?? ''}
          onChange={(e) => onSeleccionar(Number(e.target.value))}
          required>
          <option value=''>Seleccionar habitación</option>
          {filtradas.map((h) => (
            <option
              key={h.id}
              value={h.id}>
              Hab. {h.numero_habitacion} — Piso {h.piso}
              {h.tipo_habitacion ? ` (${h.tipo_habitacion.nombre})` : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
