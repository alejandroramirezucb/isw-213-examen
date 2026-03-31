import React from 'react';
import './Insignia.css';

type Props = { texto: string; variante: string };

export class Insignia extends React.Component<Props> {
  render() {
    const { texto, variante } = this.props;
    return (
      <span className={`insignia insignia--${variante.toLowerCase()}`}>
        {texto}
      </span>
    );
  }
}
