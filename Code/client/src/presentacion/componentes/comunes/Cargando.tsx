import { Component } from 'react';
import './Cargando.css';

export class Cargando extends Component {
  render() {
    return (
      <div className='cargando'>
        <div className='cargando__spinner' />
      </div>
    );
  }
}
