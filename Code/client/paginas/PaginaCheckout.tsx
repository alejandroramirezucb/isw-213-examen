import { Component } from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { FormularioCheckout } from '../componentes/estancias/FormularioCheckout';

export class PaginaCheckout extends Component {
  render() {
    return (
      <div>
        <h1 className='pagina__titulo'>Check-out</h1>
        <Tarjeta titulo='Registrar salida de huésped'>
          <FormularioCheckout />
        </Tarjeta>
      </div>
    );
  }
}


