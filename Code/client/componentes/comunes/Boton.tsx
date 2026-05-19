import { Component, ReactNode } from 'react';
import './Boton.css';

type Variante = 'primario' | 'secundario' | 'peligro';

type Props = {
  children: ReactNode;
  variante?: Variante;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
};

export class Boton extends Component<Props> {
  render() {
    const {
      children,
      variante = 'primario',
      type = 'button',
      onClick,
      disabled,
    } = this.props;
    return (
      <button
        className={`boton boton--${variante}`}
        type={type}
        onClick={onClick}
        disabled={disabled}>
        {children}
      </button>
    );
  }
}


