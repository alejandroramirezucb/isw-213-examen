import React from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { FormularioCheckout } from '../componentes/estancias/FormularioCheckout';

export class PaginaCheckout extends React.Component {
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
