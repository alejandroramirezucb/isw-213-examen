const {
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
} = require('../server/utils-calculos');

describe('Coverage: HU-01 ramas adicionales', () => {
  test('validarNombreMinimo rechaza nombre de 1 carácter', () => {
    expect(validarNombreMinimo('A')).toBe(false);
  });

  test('validarNombreMinimo rechaza null', () => {
    expect(validarNombreMinimo(null)).toBe(false);
  });

  test('validarCamposHuesped rechaza nombre vacío', () => {
    const r = validarCamposHuesped({ nombre: 'A', documento: '123', telefono: '1', correo: 'a@b.com' });
    expect(r.valido).toBe(false);
  });

  test('validarCamposHuesped rechaza teléfono vacío', () => {
    const r = validarCamposHuesped({ nombre: 'Al', documento: '123', telefono: '', correo: 'a@b.com' });
    expect(r.valido).toBe(false);
  });

  test('validarCamposHuesped rechaza correo vacío', () => {
    const r = validarCamposHuesped({ nombre: 'Al', documento: '123', telefono: '1', correo: '' });
    expect(r.valido).toBe(false);
  });

  test('validarCamposHuesped rechaza datos null', () => {
    const r = validarCamposHuesped(null);
    expect(r.valido).toBe(false);
  });

  test('documentoYaRegistrado retorna false con lista vacía', () => {
    expect(documentoYaRegistrado('123', [])).toBe(false);
  });

  test('documentoYaRegistrado retorna false con lista null', () => {
    expect(documentoYaRegistrado('123', null)).toBe(false);
  });

  test('registrarHuespedEnLista retorna error cuando validación falla', () => {
    const r = registrarHuespedEnLista({ nombre: 'A', documento: '', telefono: '1', correo: 'a@b.com' }, []);
    expect(r.ok).toBe(false);
  });
});

describe('Coverage: HU-02 ramas adicionales', () => {
  test('validarFechasReserva rechaza fechas iguales', () => {
    const r = validarFechasReserva('2026-05-20', '2026-05-20');
    expect(r.valido).toBe(false);
  });

  test('validarFechasReserva rechaza fechas nulas', () => {
    const r = validarFechasReserva(null, null);
    expect(r.valido).toBe(false);
  });

  test('validarCapacidad retorna false con capacidad 0', () => {
    expect(validarCapacidad(1, 0)).toBe(false);
  });

  test('validarCapacidad retorna false con tipos no numéricos', () => {
    expect(validarCapacidad('2', 2)).toBe(false);
  });

  test('tieneConflictoFechas detecta solapamiento parcial', () => {
    const existentes = [{ fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' }];
    expect(tieneConflictoFechas(existentes, '2026-05-23', '2026-05-27')).toBe(true);
  });

  test('tieneConflictoFechas retorna false con lista vacía', () => {
    expect(tieneConflictoFechas([], '2026-05-20', '2026-05-23')).toBe(false);
  });

  test('calcularNoches retorna 0 para fechas iguales', () => {
    expect(calcularNoches('2026-05-20', '2026-05-20')).toBe(0);
  });
});

describe('Coverage: HU-03 ramas adicionales', () => {
  test('filtrarActivasYFuturas retorna vacío con lista nula', () => {
    expect(filtrarActivasYFuturas(null, '2026-05-18')).toHaveLength(0);
  });

  test('filtrarActivasYFuturas excluye reservas pasadas no activas', () => {
    const reservas = [
      { id: 1, estado: 'PENDIENTE', fecha_checkin: '2026-01-01', fecha_checkout: '2026-01-03' },
    ];
    const filtradas = filtrarActivasYFuturas(reservas, '2026-05-18');
    expect(filtradas).toHaveLength(0);
  });

  test('ordenarPorFechaIngreso retorna vacío con null', () => {
    expect(ordenarPorFechaIngreso(null)).toHaveLength(0);
  });

  test('mensajeListadoVacio retorna null con reservas existentes', () => {
    const r = [{ id: 1, estado: 'ACTIVA', fecha_checkin: '2026-05-18', fecha_checkout: '2026-05-20' }];
    expect(mensajeListadoVacio(r)).toBeNull();
  });
});

describe('Coverage: HU-04 ramas adicionales', () => {
  test('puedeRealizarCheckin retorna error cuando reserva es null', () => {
    const r = puedeRealizarCheckin(null);
    expect(r.puede).toBe(false);
    expect(r.error).toBe('RESERVA_NO_ENCONTRADA');
  });

  test('realizarCheckin retorna error para reserva en estado ACTIVA', () => {
    const r = realizarCheckin({ id: 1, estado: 'ACTIVA', checkin_registrado: false });
    expect(r.ok).toBe(false);
  });

  test('checkinEnFechaExacta retorna false para fechas distintas', () => {
    expect(checkinEnFechaExacta('2026-05-18', '2026-05-19')).toBe(false);
  });
});

describe('Coverage: HU-05 ramas adicionales', () => {
  test('obtenerCaracteristicasTipo retorna null para tipo desconocido', () => {
    expect(obtenerCaracteristicasTipo('Penthouse')).toBeNull();
  });

  test('obtenerCaracteristicasTipo retorna null para null', () => {
    expect(obtenerCaracteristicasTipo(null)).toBeNull();
  });

  test('listarVariacionesActivas retorna vacío con lista nula', () => {
    expect(listarVariacionesActivas(null)).toHaveLength(0);
  });

  test('listarVariacionesActivas filtra todas las inactivas', () => {
    const variaciones = [{ nombre: 'Suite Premium', activo: false }];
    expect(listarVariacionesActivas(variaciones)).toHaveLength(0);
  });

  test('validarVariacionSeleccionada acepta Simple', () => {
    expect(validarVariacionSeleccionada('Simple')).toBe(true);
  });

  test('variacionesDistintas retorna false con menos de 2 tipos', () => {
    expect(variacionesDistintas([{ capacidad_maxima: 1 }])).toBe(false);
  });
});

describe('Coverage: HU-06 ramas adicionales', () => {
  test('formatearTelefono retorna número como string cuando existe', () => {
    expect(formatearTelefono('70000001')).toBe('70000001');
  });

  test('formatearTelefono retorna No disponible para string vacío', () => {
    expect(formatearTelefono('')).toBe('No disponible');
  });

  test('formatearContacto retorna null para contacto nulo', () => {
    expect(formatearContacto(null)).toBeNull();
  });

  test('listarContactos retorna vacío con lista nula', () => {
    expect(listarContactos(null)).toHaveLength(0);
  });

  test('mensajeContactosVacio retorna null con contactos existentes', () => {
    const contactos = [{ nombre: 'Limpieza', encargado: 'María', telefono: '70000001' }];
    expect(mensajeContactosVacio(contactos)).toBeNull();
  });
});

describe('Coverage: HU-08 ramas adicionales', () => {
  test('esSalidaTardia retorna false para hora anterior al límite', () => {
    expect(esSalidaTardia('10:00', '12:00')).toBe(false);
  });

  test('esSalidaTardia retorna true para 13:00 con límite 12:00', () => {
    expect(esSalidaTardia('13:00', '12:00')).toBe(true);
  });

  test('calcularCargoLate retorna 0 para minutos negativos', () => {
    expect(calcularCargoLate(-10, 20)).toBe(0);
  });

  test('calcularCargoLate retorna 0 para 0 minutos', () => {
    expect(calcularCargoLate(0, 20)).toBe(0);
  });

  test('puedeRealizarCheckout detecta checkout ya registrado', () => {
    const estancia = {
      id: 3,
      timestamp_checkin: '2026-05-20T14:00:00Z',
      timestamp_checkout: '2026-05-23T11:00:00Z',
    };
    const r = puedeRealizarCheckout(estancia);
    expect(r.puede).toBe(false);
    expect(r.error).toBe('CHECKOUT_YA_REGISTRADO');
  });
});
