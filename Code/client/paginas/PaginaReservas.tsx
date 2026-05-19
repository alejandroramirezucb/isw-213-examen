import { Component } from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { ListaReservas } from '../componentes/reservas/ListaReservas';
import { FormularioReserva } from '../componentes/reservas/FormularioReserva';

type Vista = 'listar' | 'crear';
type State = { vista: Vista };

export class PaginaReservas extends Component<{}, State> {
  state: State = { vista: 'listar' };

  render() {
    const { vista } = this.state;
    return (
      <div>
        <h1 className='pagina__titulo'>Reservas</h1>
        <div className='pagina__tabs'>
          <button
            className={`pagina__tab${vista === 'listar' ? ' pagina__tab--activo' : ''}`}
            onClick={() => this.setState({ vista: 'listar' })}>
            Reservas activas
          </button>
          <button
            className={`pagina__tab${vista === 'crear' ? ' pagina__tab--activo' : ''}`}
            onClick={() => this.setState({ vista: 'crear' })}>
            Nueva reserva
          </button>
        </div>
        {vista === 'listar' && (
          <Tarjeta titulo='Reservas pendientes y activas'>
            <ListaReservas />
          </Tarjeta>
        )}
        {vista === 'crear' && (
          <Tarjeta titulo='Crear nueva reserva'>
            <FormularioReserva
              onCreada={() => this.setState({ vista: 'listar' })}
            />
          </Tarjeta>
        )}
      </div>
    );
  }
}


