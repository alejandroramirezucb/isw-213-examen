import { createRoot } from 'react-dom/client';
import './index.css';
import { Aplicacion } from './Aplicacion';

const contenedor = document.getElementById('raiden');
if (contenedor) {
  createRoot(contenedor).render(<Aplicacion />);
}
