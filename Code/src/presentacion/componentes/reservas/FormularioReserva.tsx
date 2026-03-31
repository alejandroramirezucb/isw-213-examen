import { Component, SyntheticEvent } from 'react';
import './FormularioReserva.css';
import ApiReserva from '../../apis/ApiReserva';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';
import { BuscarHuesped } from '../huespedes/BuscarHuesped';
import { SelectorHabitacion } from '../habitaciones/SelectorHabitacion';

type Huesped = { id: number; nombres: string; apellidos: string };
type Props = { onCreada?: () => void };

type State = {
  titular: Huesped | null;
  idHabitacion: number | null;
  checkin: string;
  checkout: string;
  personas: number;
  notas: string;
  error: string | null;
  exito: string | null;
  cargando: boolean;
};

export class FormularioReserva extends Component<Props, State> {
  state: State = {
    titular: null,
    idHabitacion: null,
    checkin: '',
    checkout: '',
    personas: 1,
    notas: '',
    error: null,
    exito: null,
    cargando: false,
  };

  crear = async (evento: SyntheticEvent) => {
    evento.preventDefault();
    const { titular, idHabitacion, checkin, checkout, personas, notas } = this.state;
    
    if (!titular || !idHabitacion) {
      this.setState({ error: 'Selecciona huésped titular y habitación' });
      return;
    }
    
    this.setState({ cargando: true, error: null, exito: null });
    const resultado = await ApiReserva.crear({
      id_huesped_titular: titular.id,
      id_habitacion: idHabitacion,
      fecha_checkin: checkin,
      fecha_checkout: checkout,
      cantidad_personas: personas,
      notas: notas || undefined,
    });
    
    if (resultado.ok) {
      this.setState({
        exito: `Reserva #${resultado.val.id} creada exitosamente`,
        cargando: false,
      });
      
      if (this.props.onCreada) {
        this.props.onCreada();
      }
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  };

  render() {
    const {
      titular,
      idHabitacion,
      checkin,
      checkout,
      personas,
      notas,
      error,
      exito,
      cargando,
    } = this.state;
    return (
      <form className='formulario-reserva' onSubmit={this.crear}>
        {error && <Alerta tipo='error' mensaje={error} />}
        {exito && <Alerta tipo='exito' mensaje={exito} />}
        <BuscarHuesped
          label='Huésped titular'
          onSeleccionar={(huesped) => this.setState({ titular: huesped })}
        />
        {titular && (
          <p className='formulario-reserva__titular'>
            Titular: {titular.nombres} {titular.apellidos}
          </p>
        )}
        <div className='formulario-reserva__fila'>
          <label className='formulario-reserva__label'>Habitación</label>
          <SelectorHabitacion
            valor={idHabitacion}
            onSeleccionar={(identificador) => this.setState({ idHabitacion: identificador })}
          />
        </div>
        <div className='formulario-reserva__fila'>
          <label className='formulario-reserva__label'>Check-in</label>
          <input
            className='formulario-reserva__campo'
            type='date'
            value={checkin}
            onChange={(evento) => this.setState({ checkin: evento.target.value })}
            required
          />
        </div>
        <div className='formulario-reserva__fila'>
          <label className='formulario-reserva__label'>Check-out</label>
          <input
            className='formulario-reserva__campo'
            type='date'
            value={checkout}
            onChange={(evento) => this.setState({ checkout: evento.target.value })}
            required
          />
        </div>
        <div className='formulario-reserva__fila'>
          <label className='formulario-reserva__label'>Cantidad de personas</label>
          <input
            className='formulario-reserva__campo'
            type='number'
            min={1}
            value={personas}
            onChange={(evento) => this.setState({ personas: Number(evento.target.value) })}
            required
          />
        </div>
        <div className='formulario-reserva__fila'>
          <label className='formulario-reserva__label'>Notas</label>
          <textarea
            className='formulario-reserva__campo'
            value={notas}
            onChange={(evento) => this.setState({ notas: evento.target.value })}
            rows={3}
          />
        </div>
        <Boton type='submit' disabled={cargando}>
          Crear reserva
        </Boton>
      </form>
    );
  }
}
