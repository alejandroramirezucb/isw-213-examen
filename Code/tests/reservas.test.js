const {
  validarFechasReserva,
  calcularNoches,
  validarCapacidad,
  tieneConflictoFechas,
} = require('../server/utils-calculos');

describe('HU-02: Crear Reserva de Habitación', () => {
  test('Válida: crea reserva con huésped, habitación y fechas válidas sin conflictos', () => {
    const reservasExistentes = [];
    const fechaIngreso = '2026-05-20';
    const fechaSalida = '2026-05-23';
    const cantPersonas = 2;
    const capacidadMax = 2;

    const fechasOk = validarFechasReserva(fechaIngreso, fechaSalida);
    const capacidadOk = validarCapacidad(cantPersonas, capacidadMax);
    const hayConflicto = tieneConflictoFechas(reservasExistentes, fechaIngreso, fechaSalida);

    expect(fechasOk.valido).toBe(true);
    expect(capacidadOk).toBe(true);
    expect(hayConflicto).toBe(false);
  });

  test('Límite: acepta reserva de exactamente 1 noche (días consecutivos)', () => {
    const noches = calcularNoches('2026-05-20', '2026-05-21');
    const validacion = validarFechasReserva('2026-05-20', '2026-05-21');

    expect(noches).toBe(1);
    expect(validacion.valido).toBe(true);
  });

  test('Inválida: rechaza reserva cuando fecha de salida es anterior a la de ingreso', () => {
    const resultado = validarFechasReserva('2026-05-25', '2026-05-22');

    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBeDefined();
  });

  test('Inválida: rechaza reserva cuando cantidad de personas supera la capacidad', () => {
    const resultado = validarCapacidad(4, 2);

    expect(resultado).toBe(false);
  });
});
