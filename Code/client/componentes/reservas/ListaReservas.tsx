import { Component } from 'react';
import './ListaReservas.css';
import ApiReserva from '../../apis/ApiReserva';
import { Cargando } from '../comunes/Cargando';
import { Alerta } from '../comunes/Alerta';
import { Insignia } from '../comunes/Insignia';
import { Boton } from '../comunes/Boton';

type Reserva = {
  id: number;
  fecha_checkin: string;
  fecha_checkout: string;
  cantidad_personas: number;
  estado: string;
  notas: string | null;
  habitacion?: { id: number; numero_habitacion: string };
};

type State = {
  reservas: Reserva[];
  cargando: boolean;
  error: string | null;
  mensaje: string | null;
};

export class ListaReservas extends Component<{}, State> {
  state: State = { reservas: [], cargando: true, error: null, mensaje: null };

  async componentDidMount() {
    await this.cargar();
  }

  cargar = async () => {
    this.setState({ cargando: true, error: null });
    const resultado = await ApiReserva.listarActivas();
    
    if (resultado.ok) {
      this.setState({ reservas: resultado.val, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  };

  cancelar = async (idReserva: number) => {
    const resultado = await ApiReserva.cancelar(idReserva, {
      motivo: 'Cancelado desde sistema',
    });
    
    if (resultado.ok) {
      this.setState({ mensaje: `Reserva #${idReserva} cancelada` });
      await this.cargar();
    } else {
      this.setState({ error: resultado.val });
    }
  };

  render() {
    const { reservas, cargando, error, mensaje } = this.state;
    
    if (cargando) {
      return <Cargando />;
    }
    
    return (
      <div className='lista-reservas'>
        {error && <Alerta tipo='error' mensaje={error} />}
        {mensaje && <Alerta tipo='exito' mensaje={mensaje} />}
        {reservas.length === 0 && (
          <p className='lista-reservas__vacio'>No hay reservas activas</p>
        )}
        {reservas.length > 0 && (
          <table className='lista-reservas__tabla'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Habitación</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Personas</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>#{reserva.id}</td>
                  <td>
                    {reserva.habitacion
                      ? `Hab. ${reserva.habitacion.numero_habitacion}`
                      : '—'}
                  </td>
                  <td>{reserva.fecha_checkin}</td>
                  <td>{reserva.fecha_checkout}</td>
                  <td>{reserva.cantidad_personas}</td>
                  <td>
                    <Insignia
                      texto={reserva.estado}
                      variante={reserva.estado.toLowerCase()}
                    />
                  </td>
                  <td>
                    <Boton
                      variante='peligro'
                      onClick={() => this.cancelar(reserva.id)}>
                      Cancelar
                    </Boton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}




