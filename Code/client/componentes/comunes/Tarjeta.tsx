import { Component, ReactNode } from 'react';
import './Tarjeta.css';

type Props = { titulo?: string; children: ReactNode };

export class Tarjeta extends Component<Props> {
  render() {
    const { titulo, children } = this.props;
    return (
      <div className='tarjeta'>
        {titulo && <h2 className='tarjeta__titulo'>{titulo}</h2>}
        <div className='tarjeta__cuerpo'>{children}</div>
      </div>
    );
  }
}


