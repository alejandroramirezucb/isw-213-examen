import { Component } from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { FormularioCheckin } from '../componentes/estancias/FormularioCheckin';

export class PaginaCheckin extends Component {
  render() {
    return (
      <div>
        <h1 className='pagina__titulo'>Check-in</h1>
        <Tarjeta titulo='Registrar llegada de huésped'>
          <FormularioCheckin />
        </Tarjeta>
      </div>
    );
  }
}
