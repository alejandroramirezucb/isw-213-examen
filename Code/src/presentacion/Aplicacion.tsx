import React from 'react';
import './Aplicacion.css';
import { BarraLateral } from './componentes/comunes/BarraLateral';
import { PaginaReservas } from './paginas/PaginaReservas';
import { PaginaHuespedes } from './paginas/PaginaHuespedes';
import { PaginaCheckin } from './paginas/PaginaCheckin';
import { PaginaCheckout } from './paginas/PaginaCheckout';
import { PaginaServicios } from './paginas/PaginaServicios';

type Pagina = 'reservas' | 'huespedes' | 'checkin' | 'checkout' | 'servicios';

type State = { pagina: Pagina };

export class Aplicacion extends React.Component<{}, State> {
  state: State = { pagina: 'reservas' };

  navegar = (pagina: Pagina) => {
    this.setState({ pagina });
  };

  render() {
    const { pagina } = this.state;
    return (
      <div className="aplicacion">
        <BarraLateral pagina={pagina} onNavegar={this.navegar} />
        <main className="aplicacion__contenido">
          {pagina === 'reservas'  && <PaginaReservas />}
          {pagina === 'huespedes' && <PaginaHuespedes />}
          {pagina === 'checkin'   && <PaginaCheckin />}
          {pagina === 'checkout'  && <PaginaCheckout />}
          {pagina === 'servicios' && <PaginaServicios />}
        </main>
      </div>
    );
  }
}
