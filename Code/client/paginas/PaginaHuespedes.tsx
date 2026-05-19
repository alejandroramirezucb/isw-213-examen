import { Component } from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { BuscarHuesped } from '../componentes/huespedes/BuscarHuesped';
import { FormularioHuesped } from '../componentes/huespedes/FormularioHuesped';

type Vista = 'buscar' | 'registrar';
type State = { vista: Vista };

export class PaginaHuespedes extends Component<{}, State> {
  state: State = { vista: 'buscar' };

  render() {
    const { vista } = this.state;
    return (
      <div>
        <h1 className='pagina__titulo'>Huéspedes</h1>
        <div className='pagina__tabs'>
          <button
            className={`pagina__tab${vista === 'buscar' ? ' pagina__tab--activo' : ''}`}
            onClick={() => this.setState({ vista: 'buscar' })}>
            Buscar
          </button>
          <button
            className={`pagina__tab${vista === 'registrar' ? ' pagina__tab--activo' : ''}`}
            onClick={() => this.setState({ vista: 'registrar' })}>
            Registrar
          </button>
        </div>
        {vista === 'buscar' && (
          <Tarjeta titulo='Buscar huésped por documento'>
            <BuscarHuesped />
          </Tarjeta>
        )}
        {vista === 'registrar' && (
          <Tarjeta titulo='Registrar nuevo huésped'>
            <FormularioHuesped
              onGuardado={() => this.setState({ vista: 'buscar' })}
            />
          </Tarjeta>
        )}
      </div>
    );
  }
}


