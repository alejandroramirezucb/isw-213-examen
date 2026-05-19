import { Component } from 'react';
import './Alerta.css';

type Props = { tipo: 'exito' | 'error'; mensaje: string };

export class Alerta extends Component<Props> {
  render() {
    const { tipo, mensaje } = this.props;
    return <div className={`alerta alerta--${tipo}`}>{mensaje}</div>;
  }
}
