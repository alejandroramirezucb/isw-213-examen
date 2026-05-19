import { Component } from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { ListaContactos } from '../componentes/servicios/ListaContactos';

export class PaginaServicios extends Component {
  render() {
    return (
      <div>
        <h1 className='pagina__titulo'>Servicios</h1>
        <Tarjeta titulo='Contactos de servicio activos'>
          <ListaContactos />
        </Tarjeta>
      </div>
    );
  }
}
