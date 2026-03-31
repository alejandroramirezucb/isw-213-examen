import React from 'react';
import './ListaContactos.css';
import ApiContactoServicio from '../../apis/ApiContactoServicio';
import { Cargando } from '../comunes/Cargando';
import { Alerta } from '../comunes/Alerta';

type ContactoServicio = {
  id: number;
  nombre: string;
  encargado: string;
  telefono: string;
  activo: boolean;
};

type State = {
  contactos: ContactoServicio[];
  cargando: boolean;
  error: string | null;
};

export class ListaContactos extends React.Component<{}, State> {
  state: State = { contactos: [], cargando: true, error: null };

  async componentDidMount() {
    const resultado = await ApiContactoServicio.listarActivos();
    if (resultado.ok) {
      this.setState({ contactos: resultado.val, cargando: false });
    } else {
      this.setState({ error: resultado.val, cargando: false });
    }
  }

  render() {
    const { contactos, cargando, error } = this.state;
    if (cargando) {
      return <Cargando />;
    }
    return (
      <div className='lista-contactos'>
        {error && (
          <Alerta
            tipo='error'
            mensaje={error}
          />
        )}
        {contactos.length === 0 && (
          <p className='lista-contactos__vacio'>
            No hay contactos de servicio activos
          </p>
        )}
        {contactos.length > 0 && (
          <table className='lista-contactos__tabla'>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Encargado</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.encargado}</td>
                  <td>{c.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
