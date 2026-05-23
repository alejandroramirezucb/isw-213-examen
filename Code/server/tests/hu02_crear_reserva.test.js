const {
  validarFechasReserva,
  calcularNoches,
  validarCapacidad,
  tieneConflictoFechas,
} = require('../utils-calculos.js');

describe('HU-02 Crear reserva - Validaciones', () => {

  describe('validarFechasReserva', () => {
    it('debe validar fechas válidas', () => {
      const resultado = validarFechasReserva('2026-05-20', '2026-05-25');

      expect(resultado.valido).toBe(true);
      expect(resultado.error).toBe(null);
    });

    it('debe rechazar cuando falta fechaIngreso', () => {
      const resultado = validarFechasReserva(null, '2026-05-25');

      expect(resultado.valido).toBe(false);
      expect(resultado.error).toContain('obligatorias');
    });

    it('debe rechazar cuando falta fechaSalida', () => {
      const resultado = validarFechasReserva('2026-05-20', null);

      expect(resultado.valido).toBe(false);
      expect(resultado.error).toContain('obligatorias');
    });

    it('debe rechazar cuando falta ambas fechas', () => {
      const resultado = validarFechasReserva(null, null);

      expect(resultado.valido).toBe(false);
    });

    it('debe rechazar fechas inválidas', () => {
      const resultado = validarFechasReserva('fecha-invalida', '2026-05-25');

      expect(resultado.valido).toBe(false);
      expect(resultado.error).toContain('inválidas');
    });

    it('debe rechazar cuando salida no es posterior a ingreso', () => {
      const resultado = validarFechasReserva('2026-05-25', '2026-05-25');

      expect(resultado.valido).toBe(false);
      expect(resultado.error).toContain('posterior');
    });

    it('debe rechazar cuando salida es anterior a ingreso', () => {
      const resultado = validarFechasReserva('2026-05-25', '2026-05-20');

      expect(resultado.valido).toBe(false);
      expect(resultado.error).toContain('posterior');
    });
  });

  describe('calcularNoches', () => {
    it('debe calcular noches correctamente', () => {
      const noches = calcularNoches('2026-05-20', '2026-05-25');

      expect(noches).toBe(5);
    });

    it('debe calcular una noche', () => {
      const noches = calcularNoches('2026-05-20', '2026-05-21');

      expect(noches).toBe(1);
    });

    it('debe calcular muchas noches', () => {
      const noches = calcularNoches('2026-01-01', '2026-12-31');

      expect(noches).toBeGreaterThan(300);
    });
  });

  describe('validarCapacidad', () => {
    it('debe aceptar cuando cantidad igual a capacidad máxima', () => {
      const resultado = validarCapacidad(2, 2);

      expect(resultado).toBe(true);
    });

    it('debe aceptar cuando cantidad menor a capacidad máxima', () => {
      const resultado = validarCapacidad(1, 2);

      expect(resultado).toBe(true);
    });

    it('debe rechazar cuando cantidad mayor a capacidad máxima', () => {
      const resultado = validarCapacidad(3, 2);

      expect(resultado).toBe(false);
    });

    it('debe retornar false si cantidad no es número', () => {
      const resultado = validarCapacidad('texto', 2);

      expect(resultado).toBe(false);
    });

    it('debe retornar false si capacidad no es número', () => {
      const resultado = validarCapacidad(2, 'texto');

      expect(resultado).toBe(false);
    });
  });

  describe('tieneConflictoFechas', () => {
    it('debe retornar false cuando no hay reservas existentes', () => {
      const resultado = tieneConflictoFechas([], '2026-05-20', '2026-05-25');

      expect(resultado).toBe(false);
    });

    it('debe retornar false cuando lista es null', () => {
      const resultado = tieneConflictoFechas(null, '2026-05-20', '2026-05-25');

      expect(resultado).toBe(false);
    });

    it('debe detectar solapamiento cuando nueva está dentro de existente', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-15', fecha_checkout: '2026-05-30' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-20',
        '2026-05-25'
      );

      expect(resultado).toBe(true);
    });

    it('debe detectar solapamiento cuando nueva abarca existente', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-15',
        '2026-05-30'
      );

      expect(resultado).toBe(true);
    });

    it('debe detectar solapamiento cuando fechas tocan el inicio', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-15',
        '2026-05-20'
      );

      expect(resultado).toBe(false);
    });

    it('debe detectar solapamiento cuando fechas tocan el final', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-25',
        '2026-05-30'
      );

      expect(resultado).toBe(false);
    });

    it('debe retornar false cuando no hay solapamiento', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-25' },
        { fecha_checkin: '2026-06-01', fecha_checkout: '2026-06-05' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-26',
        '2026-05-31'
      );

      expect(resultado).toBe(false);
    });

    it('debe detectar solapamiento con múltiples reservas', () => {
      const reservasExistentes = [
        { fecha_checkin: '2026-05-05', fecha_checkout: '2026-05-10' },
        { fecha_checkin: '2026-05-15', fecha_checkout: '2026-05-20' },
        { fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-30' },
      ];

      const resultado = tieneConflictoFechas(
        reservasExistentes,
        '2026-05-28',
        '2026-06-01'
      );

      expect(resultado).toBe(true);
    });
  });
});
