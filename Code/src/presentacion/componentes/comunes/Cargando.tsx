import React from 'react';
import './Cargando.css';

export class Cargando extends React.Component {
  render() {
    return (
      <div className='cargando'>
        <div className='cargando__spinner' />
      </div>
    );
  }
}
