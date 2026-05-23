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
} = require('../utils-calculos.js');

describe('Utilidades de cálculo - Cobertura completa', () => {

  describe('validarNombreMinimo', () => {
    it('debe aceptar nombre con 2+ caracteres', () => {
      expect(validarNombreMinimo('Jo')).toBe(true);
      expect(validarNombreMinimo('Juan')).toBe(true);
    });

    it('debe rechazar nombre con < 2 caracteres', () => {
      expect(validarNombreMinimo('J')).toBe(false);
    });

    it('debe rechazar nombre vacío', () => {
      expect(validarNombreMinimo('')).toBe(false);
    });

    it('debe rechazar null', () => {
      expect(validarNombreMinimo(null)).toBe(false);
    });

    it('debe rechazar no-string', () => {
      expect(validarNombreMinimo(123)).toBe(false);
    });

    it('debe ignorar espacios', () => {
      expect(validarNombreMinimo('  Jo  ')).toBe(true);
    });
  });

  describe('validarCamposHuesped', () => {
    it('debe aceptar datos válidos', () => {
      const resultado = validarCamposHuesped({
        nombre: 'Juan',
        documento: '123',
        telefono: '123',
        correo: 'a@b.com',
      });
      expect(resultado.valido).toBe(true);
    });

    it('debe rechazar null', () => {
      expect(validarCamposHuesped(null).valido).toBe(false);
    });

    it('debe rechazar nombre vacío', () => {
      const resultado = validarCamposHuesped({
        nombre: '',
        documento: '123',
        telefono: '123',
        correo: 'a@b.com',
      });
      expect(resultado.valido).toBe(false);
    });

    it('debe rechazar documento vacío', () => {
      const resultado = validarCamposHuesped({
        nombre: 'Juan',
        documento: '',
        telefono: '123',
        correo: 'a@b.com',
      });
      expect(resultado.valido).toBe(false);
    });

    it('debe rechazar teléfono vacío', () => {
      const resultado = validarCamposHuesped({
        nombre: 'Juan',
        documento: '123',
        telefono: '',
        correo: 'a@b.com',
      });
      expect(resultado.valido).toBe(false);
    });

    it('debe rechazar correo vacío', () => {
      const resultado = validarCamposHuesped({
        nombre: 'Juan',
        documento: '123',
        telefono: '123',
        correo: '',
      });
      expect(resultado.valido).toBe(false);
    });
  });

  describe('documentoYaRegistrado', () => {
    it('debe encontrar documento existente', () => {
      expect(documentoYaRegistrado('123', [{ documento: '123' }])).toBe(true);
    });

    it('debe no encontrar documento inexistente', () => {
      expect(documentoYaRegistrado('999', [{ documento: '123' }])).toBe(false);
    });

    it('debe retornar false con lista null', () => {
      expect(documentoYaRegistrado('123', null)).toBe(false);
    });
  });

  describe('registrarHuespedEnLista', () => {
    it('debe registrar huésped válido', () => {
      const lista = [];
      const resultado = registrarHuespedEnLista(
        { nombre: 'Juan', documento: '123', telefono: '123', correo: 'a@b' },
        lista
      );
      expect(resultado.ok).toBe(true);
      expect(lista.length).toBe(1);
    });

    it('debe rechazar huésped inválido', () => {
      const lista = [];
      const resultado = registrarHuespedEnLista(
        { nombre: '', documento: '123', telefono: '123', correo: 'a@b' },
        lista
      );
      expect(resultado.ok).toBe(false);
    });

    it('debe rechazar duplicado', () => {
      const lista = [{ documento: '123' }];
      const resultado = registrarHuespedEnLista(
        { nombre: 'Juan', documento: '123', telefono: '123', correo: 'a@b' },
        lista
      );
      expect(resultado.ok).toBe(false);
    });
  });

  describe('validarFechasReserva', () => {
    it('debe aceptar fechas válidas', () => {
      const resultado = validarFechasReserva('2026-05-20', '2026-05-25');
      expect(resultado.valido).toBe(true);
    });

    it('debe rechazar falta de fechas', () => {
      expect(validarFechasReserva(null, '2026-05-25').valido).toBe(false);
    });

    it('debe rechazar fechas iguales', () => {
      expect(validarFechasReserva('2026-05-20', '2026-05-20').valido).toBe(false);
    });

    it('debe rechazar salida anterior a ingreso', () => {
      expect(validarFechasReserva('2026-05-25', '2026-05-20').valido).toBe(false);
    });

    it('debe rechazar fechas inválidas', () => {
      expect(validarFechasReserva('invalida', '2026-05-25').valido).toBe(false);
    });
  });

  describe('calcularNoches', () => {
    it('debe calcular noches correctamente', () => {
      expect(calcularNoches('2026-05-20', '2026-05-25')).toBe(5);
    });

    it('debe calcular una noche', () => {
      expect(calcularNoches('2026-05-20', '2026-05-21')).toBe(1);
    });
  });

  describe('validarCapacidad', () => {
    it('debe aceptar cantidad igual a capacidad', () => {
      expect(validarCapacidad(2, 2)).toBe(true);
    });

    it('debe aceptar cantidad menor a capacidad', () => {
      expect(validarCapacidad(1, 2)).toBe(true);
    });

    it('debe rechazar cantidad mayor a capacidad', () => {
      expect(validarCapacidad(3, 2)).toBe(false);
    });

    it('debe retornar false si cantidad no es número', () => {
      expect(validarCapacidad('texto', 2)).toBe(false);
    });
  });

  describe('tieneConflictoFechas', () => {
    it('debe retornar false sin reservas', () => {
      expect(tieneConflictoFechas([], '2026-05-20', '2026-05-25')).toBe(false);
    });

    it('debe detectar solapamiento', () => {
      const reservas = [{ fecha_checkin: '2026-05-15', fecha_checkout: '2026-05-30' }];
      expect(tieneConflictoFechas(reservas, '2026-05-20', '2026-05-25')).toBe(true);
    });

    it('debe no detectar conflicto sin solapamiento', () => {
      const reservas = [{ fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' }];
      expect(tieneConflictoFechas(reservas, '2026-05-26', '2026-05-31')).toBe(false);
    });
  });

  describe('filtrarActivasYFuturas', () => {
    it('debe retornar lista vacía si null', () => {
      expect(filtrarActivasYFuturas(null, '2026-05-23')).toEqual([]);
    });

    it('debe retornar lista vacía si lista vacía', () => {
      expect(filtrarActivasYFuturas([], '2026-05-23')).toEqual([]);
    });

    it('debe filtrar canceladas', () => {
      const reservas = [
        { estado: 'CANCELADA', fecha_checkin: '2026-05-25' },
        { estado: 'ACTIVA', fecha_checkin: '2026-05-25' },
      ];
      const resultado = filtrarActivasYFuturas(reservas, '2026-05-23');
      expect(resultado.length).toBe(1);
      expect(resultado[0].estado).toBe('ACTIVA');
    });
  });

  describe('ordenarPorFechaIngreso', () => {
    it('debe retornar lista vacía si null', () => {
      expect(ordenarPorFechaIngreso(null)).toEqual([]);
    });

    it('debe ordenar cronológicamente', () => {
      const reservas = [
        { id: 2, fecha_checkin: '2026-05-25' },
        { id: 1, fecha_checkin: '2026-05-20' },
      ];
      const resultado = ordenarPorFechaIngreso(reservas);
      expect(resultado[0].id).toBe(1);
    });
  });

  describe('mensajeListadoVacio', () => {
    it('debe retornar null si hay datos', () => {
      expect(mensajeListadoVacio([{ id: 1 }])).toBeNull();
    });

    it('debe retornar mensaje si vacío', () => {
      expect(mensajeListadoVacio([])).toBeDefined();
    });
  });

  describe('puedeRealizarCheckin', () => {
    it('debe rechazar null', () => {
      const resultado = puedeRealizarCheckin(null);
      expect(resultado.puede).toBe(false);
    });

    it('debe aceptar reserva válida', () => {
      const resultado = puedeRealizarCheckin({ estado: 'PENDIENTE' });
      expect(resultado.puede).toBe(true);
    });

    it('debe rechazar estado inválido', () => {
      const resultado = puedeRealizarCheckin({ estado: 'CANCELADA' });
      expect(resultado.puede).toBe(false);
    });

    it('debe rechazar si ya tiene checkin', () => {
      const resultado = puedeRealizarCheckin({ estado: 'PENDIENTE', checkin_registrado: true });
      expect(resultado.puede).toBe(false);
    });
  });

  describe('realizarCheckin', () => {
    it('debe realizar checkin válido', () => {
      const resultado = realizarCheckin({ estado: 'PENDIENTE' });
      expect(resultado.ok).toBe(true);
    });

    it('debe rechazar checkin inválido', () => {
      const resultado = realizarCheckin(null);
      expect(resultado.ok).toBe(false);
    });
  });

  describe('checkinEnFechaExacta', () => {
    it('debe detectar checkin en fecha exacta - mismo día', () => {
      const resultado = checkinEnFechaExacta('2026-05-23', '2026-05-23');
      expect(resultado).toBe(true);
    });

    it('debe no detectar checkin en fecha diferente - día diferente', () => {
      const resultado = checkinEnFechaExacta('2026-05-23', '2026-05-24');
      expect(resultado).toBe(false);
    });

    it('debe no detectar checkin en fecha diferente - mes diferente', () => {
      const resultado = checkinEnFechaExacta('2026-05-23', '2026-06-23');
      expect(resultado).toBe(false);
    });

    it('debe no detectar checkin en fecha diferente - año diferente', () => {
      const resultado = checkinEnFechaExacta('2026-05-23', '2025-05-23');
      expect(resultado).toBe(false);
    });
  });

  describe('obtenerCaracteristicasTipo', () => {
    it('debe obtener características válidas Simple', () => {
      const resultado = obtenerCaracteristicasTipo('Simple');
      expect(resultado).toBeDefined();
      expect(resultado.nombre).toBe('Simple');
      expect(resultado.capacidad_maxima).toBe(1);
    });

    it('debe obtener características válidas Suite', () => {
      const resultado = obtenerCaracteristicasTipo('Suite');
      expect(resultado.nombre).toBe('Suite');
      expect(resultado.capacidad_maxima).toBe(2);
    });

    it('debe obtener características válidas Doble Individual', () => {
      const resultado = obtenerCaracteristicasTipo('Doble Individual');
      expect(resultado.nombre).toBe('Doble Individual');
    });

    it('debe obtener características válidas Doble Matrimonial', () => {
      const resultado = obtenerCaracteristicasTipo('Doble Matrimonial');
      expect(resultado.nombre).toBe('Doble Matrimonial');
    });

    it('debe retornar null si tipo no existe', () => {
      expect(obtenerCaracteristicasTipo('Tipo Inexistente')).toBeNull();
    });

    it('debe retornar null si nombre es null', () => {
      expect(obtenerCaracteristicasTipo(null)).toBeNull();
    });

    it('debe retornar null si nombre es undefined', () => {
      expect(obtenerCaracteristicasTipo(undefined)).toBeNull();
    });

    it('debe retornar null si nombre es string vacío', () => {
      expect(obtenerCaracteristicasTipo('')).toBeNull();
    });
  });

  describe('listarVariacionesActivas', () => {
    it('debe filtrar solo activas', () => {
      const variaciones = [
        { activo: true },
        { activo: false },
      ];
      const resultado = listarVariacionesActivas(variaciones);
      expect(resultado.length).toBe(1);
    });

    it('debe retornar lista vacía si null', () => {
      expect(listarVariacionesActivas(null)).toEqual([]);
    });
  });

  describe('validarVariacionSeleccionada', () => {
    it('debe aceptar variación válida', () => {
      expect(validarVariacionSeleccionada('Simple')).toBe(true);
    });

    it('debe rechazar variación inválida', () => {
      expect(validarVariacionSeleccionada('Inexistente')).toBe(false);
    });

    it('debe rechazar null', () => {
      expect(validarVariacionSeleccionada(null)).toBe(false);
    });
  });

  describe('variacionesDistintas', () => {
    it('debe retornar true si capacidades distintas', () => {
      const tipos = [{ capacidad_maxima: 1 }, { capacidad_maxima: 2 }];
      expect(variacionesDistintas(tipos)).toBe(true);
    });

    it('debe retornar false si capacidades iguales', () => {
      const tipos = [{ capacidad_maxima: 2 }, { capacidad_maxima: 2 }];
      expect(variacionesDistintas(tipos)).toBe(false);
    });

    it('debe retornar false si < 2 tipos', () => {
      expect(variacionesDistintas([{ capacidad_maxima: 1 }])).toBe(false);
    });
  });

  describe('formatearTelefono', () => {
    it('debe devolver teléfono válido', () => {
      expect(formatearTelefono('5551234')).toBe('5551234');
    });

    it('debe devolver "No disponible" si vacío', () => {
      expect(formatearTelefono('')).toBe('No disponible');
    });

    it('debe devolver "No disponible" si null', () => {
      expect(formatearTelefono(null)).toBe('No disponible');
    });
  });

  describe('formatearContacto', () => {
    it('debe formatear contacto válido', () => {
      const contacto = { nombre: 'Mantenimiento', encargado: 'Juan', telefono: '123' };
      const resultado = formatearContacto(contacto);
      expect(resultado.nombre).toBe('Mantenimiento');
    });

    it('debe retornar null si null', () => {
      expect(formatearContacto(null)).toBeNull();
    });
  });

  describe('listarContactos', () => {
    it('debe listar contactos válidos', () => {
      const contactos = [{ nombre: 'Mantenimiento', encargado: 'Juan', telefono: '123' }];
      const resultado = listarContactos(contactos);
      expect(resultado.length).toBe(1);
    });

    it('debe retornar lista vacía si null', () => {
      expect(listarContactos(null)).toEqual([]);
    });
  });

  describe('mensajeContactosVacio', () => {
    it('debe retornar null si hay contactos', () => {
      expect(mensajeContactosVacio([{ id: 1 }])).toBeNull();
    });

    it('debe retornar mensaje si vacío', () => {
      expect(mensajeContactosVacio([])).toBeDefined();
    });
  });

  describe('esSalidaTardia', () => {
    it('debe detectar salida tardia', () => {
      expect(esSalidaTardia('12:30', '12:00')).toBe(true);
    });

    it('debe no detectar salida tardia si dentro límite', () => {
      expect(esSalidaTardia('11:30', '12:00')).toBe(false);
    });

    it('debe no detectar salida tardia si exacta', () => {
      expect(esSalidaTardia('12:00', '12:00')).toBe(false);
    });
  });

  describe('calcularCargoLate', () => {
    it('debe calcular cargo por retraso', () => {
      expect(calcularCargoLate(60, 100)).toBe(100);
    });

    it('debe retornar 0 si sin retraso', () => {
      expect(calcularCargoLate(0, 100)).toBe(0);
    });

    it('debe retornar 0 si retraso negativo', () => {
      expect(calcularCargoLate(-30, 100)).toBe(0);
    });
  });

  describe('puedeRealizarCheckout', () => {
    it('debe aceptar checkout válido', () => {
      const resultado = puedeRealizarCheckout({ timestamp_checkin: '2026-05-23T10:00:00' });
      expect(resultado.puede).toBe(true);
    });

    it('debe rechazar sin checkin', () => {
      const resultado = puedeRealizarCheckout(null);
      expect(resultado.puede).toBe(false);
    });

    it('debe rechazar si ya tiene checkout', () => {
      const resultado = puedeRealizarCheckout({
        timestamp_checkin: '2026-05-23T10:00:00',
        timestamp_checkout: '2026-05-23T11:00:00',
      });
      expect(resultado.puede).toBe(false);
    });
  });
});
