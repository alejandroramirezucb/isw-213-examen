import { Component } from 'react';
import './BarraLateral.css';

type Pagina = 'reservas' | 'huespedes' | 'checkin' | 'checkout' | 'servicios' | 'configuracion';
type Props = { pagina: Pagina; onNavegar: (p: Pagina) => void };

const ITEMS: { pagina: Pagina; etiqueta: string }[] = [
  { pagina: 'reservas',  etiqueta: 'Reservas' },
  { pagina: 'huespedes', etiqueta: 'Huéspedes' },
  { pagina: 'checkin',   etiqueta: 'Check-in' },
  { pagina: 'checkout',  etiqueta: 'Check-out' },
  { pagina: 'servicios', etiqueta: 'Servicios' },
  { pagina: 'configuracion', etiqueta: 'Configuración' },
];

export class BarraLateral extends Component<Props> {
  render() {
    const { pagina, onNavegar } = this.props;
    return (
      <aside className='barra-lateral'>
        <div className='barra-lateral__logo'>Raidenhotel</div>
        <nav className='barra-lateral__nav'>
          {ITEMS.map((item) => (
            <button
              key={item.pagina}
              className={`barra-lateral__item${pagina === item.pagina ? ' barra-lateral__item--activo' : ''}`}
              onClick={() => onNavegar(item.pagina)}>
              {item.etiqueta}
            </button>
          ))}
        </nav>
      </aside>
    );
  }
}


