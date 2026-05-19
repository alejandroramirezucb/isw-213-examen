// HU-01: Registrar Huésped

function validarNombreMinimo(nombre) {
  if (!nombre || typeof nombre !== 'string') return false;
  return nombre.trim().length >= 2;
}

function validarCamposHuesped(datos) {
  if (!datos) return { valido: false, error: 'Datos requeridos' };
  const { nombre, documento, telefono, correo } = datos;

  if (!nombre || nombre.trim().length < 2) {
    return { valido: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (!documento || documento.trim() === '') {
    return { valido: false, error: 'El documento de identidad es obligatorio' };
  }
  if (!telefono || telefono.trim() === '') {
    return { valido: false, error: 'El teléfono es obligatorio' };
  }
  if (!correo || correo.trim() === '') {
    return { valido: false, error: 'El correo es obligatorio' };
  }
  return { valido: true, error: null };
}

function documentoYaRegistrado(documento, lista) {
  if (!lista || !Array.isArray(lista)) return false;
  return lista.some(h => h.documento === documento);
}

function registrarHuespedEnLista(datos, lista) {
  const validacion = validarCamposHuesped(datos);
  if (!validacion.valido) {
    return { ok: false, error: validacion.error };
  }
  if (documentoYaRegistrado(datos.documento, lista)) {
    return { ok: false, error: 'El documento ya está registrado' };
  }
  const huesped = { ...datos, id: lista.length + 1 };
  lista.push(huesped);
  return { ok: true, huesped };
}

// HU-02: Crear Reserva

function validarFechasReserva(fechaIngreso, fechaSalida) {
  if (!fechaIngreso || !fechaSalida) {
    return { valido: false, error: 'Las fechas son obligatorias' };
  }
  const ingreso = new Date(fechaIngreso);
  const salida = new Date(fechaSalida);
  if (isNaN(ingreso.getTime()) || isNaN(salida.getTime())) {
    return { valido: false, error: 'Fechas inválidas' };
  }
  if (salida <= ingreso) {
    return { valido: false, error: 'La fecha de salida debe ser posterior a la de ingreso' };
  }
  return { valido: true, error: null };
}

function calcularNoches(fechaIngreso, fechaSalida) {
  const ingreso = new Date(fechaIngreso);
  const salida = new Date(fechaSalida);
  const diff = salida.getTime() - ingreso.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function validarCapacidad(cantPersonas, capacidadMax) {
  if (typeof cantPersonas !== 'number' || typeof capacidadMax !== 'number') return false;
  return cantPersonas <= capacidadMax;
}

function tieneConflictoFechas(reservasExistentes, nuevaIngreso, nuevaSalida) {
  if (!reservasExistentes || reservasExistentes.length === 0) return false;
  const ingreso = new Date(nuevaIngreso);
  const salida = new Date(nuevaSalida);
  return reservasExistentes.some(r => {
    const rIngreso = new Date(r.fecha_checkin);
    const rSalida = new Date(r.fecha_checkout);
    return ingreso < rSalida && salida > rIngreso;
  });
}

// HU-03: Listado Reservas

const ESTADO_CANCELADA = 'CANCELADA';
const ESTADO_PENDIENTE = 'PENDIENTE';
const ESTADO_ACTIVA = 'ACTIVA';

function filtrarActivasYFuturas(reservas, hoy) {
  if (!reservas || reservas.length === 0) return [];
  const fechaHoy = new Date(hoy);
  fechaHoy.setHours(0, 0, 0, 0);
  return reservas.filter(r => {
    if (r.estado === ESTADO_CANCELADA) return false;
    const ingreso = new Date(r.fecha_checkin);
    ingreso.setHours(0, 0, 0, 0);
    return ingreso >= fechaHoy || r.estado === ESTADO_ACTIVA;
  });
}

function ordenarPorFechaIngreso(reservas) {
  if (!reservas) return [];
  return [...reservas].sort(
    (a, b) => new Date(a.fecha_checkin) - new Date(b.fecha_checkin)
  );
}

function mensajeListadoVacio(reservas) {
  if (!reservas || reservas.length === 0) return 'No hay reservas disponibles';
  return null;
}

// HU-04: Check-In

function puedeRealizarCheckin(reserva) {
  if (!reserva) return { puede: false, error: 'RESERVA_NO_ENCONTRADA' };
  if (reserva.estado !== ESTADO_PENDIENTE) {
    return { puede: false, error: 'ESTADO_INVALIDO' };
  }
  if (reserva.checkin_registrado) {
    return { puede: false, error: 'CHECKIN_YA_REGISTRADO' };
  }
  return { puede: true };
}

function realizarCheckin(reserva) {
  const validacion = puedeRealizarCheckin(reserva);
  if (!validacion.puede) {
    return { ok: false, error: validacion.error };
  }
  return { ok: true, estado: ESTADO_ACTIVA, timestamp: new Date().toISOString() };
}

function checkinEnFechaExacta(fechaReserva, hoy) {
  const fr = new Date(fechaReserva);
  const fh = new Date(hoy);
  return (
    fr.getFullYear() === fh.getFullYear() &&
    fr.getMonth() === fh.getMonth() &&
    fr.getDate() === fh.getDate()
  );
}

// HU-05: Variaciones de Habitación

const TIPOS_HABITACION = {
  Simple: {
    nombre: 'Simple',
    descripcion: 'Habitación simple con cama individual',
    capacidad_maxima: 1,
    precio_referencia: 50,
  },
  Suite: {
    nombre: 'Suite',
    descripcion: 'Suite con cama king y jacuzzi',
    capacidad_maxima: 2,
    precio_referencia: 150,
  },
  'Doble Individual': {
    nombre: 'Doble Individual',
    descripcion: 'Habitación con dos camas individuales',
    capacidad_maxima: 2,
    precio_referencia: 80,
  },
  'Doble Matrimonial': {
    nombre: 'Doble Matrimonial',
    descripcion: 'Habitación con cama matrimonial',
    capacidad_maxima: 2,
    precio_referencia: 90,
  },
};

function obtenerCaracteristicasTipo(nombre) {
  if (!nombre) return null;
  return TIPOS_HABITACION[nombre] || null;
}

function listarVariacionesActivas(variaciones) {
  if (!variaciones || !Array.isArray(variaciones)) return [];
  return variaciones.filter(v => v.activo === true);
}

function validarVariacionSeleccionada(nombre) {
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') return false;
  return Object.prototype.hasOwnProperty.call(TIPOS_HABITACION, nombre);
}

function variacionesDistintas(tipos) {
  if (!tipos || tipos.length < 2) return false;
  const capacidades = tipos.map(t => t.capacidad_maxima);
  return new Set(capacidades).size === tipos.length;
}

// HU-06: Contactos de Servicios

function formatearTelefono(telefono) {
  if (!telefono || telefono.toString().trim() === '') return 'No disponible';
  return telefono.toString();
}

function formatearContacto(contacto) {
  if (!contacto) return null;
  return {
    nombre: contacto.nombre,
    encargado: contacto.encargado,
    telefono: formatearTelefono(contacto.telefono),
  };
}

function listarContactos(contactos) {
  if (!contactos || !Array.isArray(contactos)) return [];
  return contactos.map(formatearContacto);
}

function mensajeContactosVacio(contactos) {
  if (!contactos || contactos.length === 0) return 'No hay contactos disponibles';
  return null;
}

// HU-08: Check-Out con Late Check-Out

function parsearHora(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

function esSalidaTardia(horaActual, horaLimite) {
  const actual = parsearHora(horaActual);
  const limite = parsearHora(horaLimite);
  return actual > limite;
}

function calcularCargoLate(minutosRetraso, tarifaPorHora) {
  if (minutosRetraso <= 0) return 0;
  return (minutosRetraso / 60) * tarifaPorHora;
}

function puedeRealizarCheckout(estancia) {
  if (!estancia || !estancia.timestamp_checkin) {
    return { puede: false, error: 'ESTANCIA_NO_ENCONTRADA' };
  }
  if (estancia.timestamp_checkout) {
    return { puede: false, error: 'CHECKOUT_YA_REGISTRADO' };
  }
  return { puede: true };
}

module.exports = {
  validarNombreMinimo,
  validarCamposHuesped,
  documentoYaRegistrado,
  registrarHuespedEnLista,
  validarFechasReserva,
  calcularNoches,
  validarCapacidad,
  tieneConflictoFechas,
  filtrarActivasYFuturas,
  ordenarPorFechaIngreso,
  mensajeListadoVacio,
  puedeRealizarCheckin,
  realizarCheckin,
  checkinEnFechaExacta,
  obtenerCaracteristicasTipo,
  listarVariacionesActivas,
  validarVariacionSeleccionada,
  variacionesDistintas,
  formatearTelefono,
  formatearContacto,
  listarContactos,
  mensajeContactosVacio,
  esSalidaTardia,
  calcularCargoLate,
  puedeRealizarCheckout,
};
