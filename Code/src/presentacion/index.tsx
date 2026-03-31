import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Aplicacion } from './Aplicacion';

const container = document.getElementById('raiden');

if (container) {
  createRoot(container).render(<Aplicacion />);
}
