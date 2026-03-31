import React from 'react';
import { Tarjeta } from '../componentes/comunes/Tarjeta';
import { ListaContactos } from '../componentes/servicios/ListaContactos';

export class PaginaServicios extends React.Component {
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
