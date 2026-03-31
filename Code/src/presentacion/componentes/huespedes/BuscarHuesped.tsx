import { Component } from 'react';
import './BuscarHuesped.css';
import ApiHuesped from '../../apis/ApiHuesped';
import { Boton } from '../comunes/Boton';
import { Alerta } from '../comunes/Alerta';

type Huesped = {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo_reserva: string;
  telefono: string | null;
};

type Props = { onSeleccionar?: (huesped: Huesped) => void; label?: string };

type State = {
  tipo: string;
  numero: string;
  huesped: Huesped | null;
  error: string | null;
  cargando: boolean;
};

export class BuscarHuesped extends Component<Props, State> {
  state: State = {
    tipo: 'carnet',
    numero: '',
    huesped: null,
    error: null,
    cargando: false,
  };

  buscar = async () => {
    const { tipo, numero } = this.state;

    if (!numero) {
      return;
    }

    this.setState({ cargando: true, error: null, huesped: null });
    const resultado = await ApiHuesped.buscarPorDocumento(tipo, numero);

    if (resultado.ok) {
      this.setState({ huesped: resultado.val, cargando: false });

      if (this.props.onSeleccionar) {
        this.props.onSeleccionar(resultado.val);
      }
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  };

  render() {
    const { tipo, numero, huesped, error, cargando } = this.state;
    const { label = 'Buscar huésped' } = this.props;

    return (
      <div className='buscar-huesped'>
        <p className='buscar-huesped__etiqueta'>{label}</p>
        <div className='buscar-huesped__fila'>
          <select
            className='buscar-huesped__select'
            value={tipo}
            onChange={(evento) => this.setState({ tipo: evento.target.value })}>
            <option value='carnet'>Carné</option>
            <option value='pasaporte'>Pasaporte</option>
            <option value='carnet_extranjero'>Carné de extranjería</option>
            <option value='nit'>NIT</option>
          </select>
          <input
            className='buscar-huesped__input'
            placeholder='Número de documento'
            value={numero}
            onChange={(evento) =>
              this.setState({ numero: evento.target.value })
            }
          />
          <Boton
            onClick={this.buscar}
            disabled={cargando}>
            Buscar
          </Boton>
        </div>
        {error && (
          <Alerta
            tipo='error'
            mensaje={error}
          />
        )}
        {huesped && (
          <div className='buscar-huesped__resultado'>
            {huesped.nombres} {huesped.apellidos} — {huesped.tipo_documento}:{' '}
            {huesped.numero_documento}
          </div>
        )}
      </div>
    );
  }
}
