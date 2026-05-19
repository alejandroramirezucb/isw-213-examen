const {
  puedeRealizarCheckin,
  realizarCheckin,
  checkinEnFechaExacta,
} = require('../server/utils-calculos');

describe('HU-04: Registrar Check-In', () => {
  test('Válida: registra check-in y cambia estado a ACTIVA en reserva PENDIENTE sin checkin previo', () => {
    const reserva = { id: 7, estado: 'PENDIENTE', checkin_registrado: false };

    const validacion = puedeRealizarCheckin(reserva);
    const resultado = realizarCheckin(reserva);

    expect(validacion.puede).toBe(true);
    expect(resultado.ok).toBe(true);
    expect(resultado.estado).toBe('ACTIVA');
  });

  test('Límite: permite check-in exactamente en la fecha de ingreso de la reserva', () => {
    const fechaReserva = '2026-05-18';
    const hoy = '2026-05-18';

    const esExacta = checkinEnFechaExacta(fechaReserva, hoy);

    expect(esExacta).toBe(true);
  });

  test('Inválida: bloquea check-in de reserva cancelada', () => {
    const reserva = { id: 3, estado: 'CANCELADA', checkin_registrado: false };

    const resultado = puedeRealizarCheckin(reserva);

    expect(resultado.puede).toBe(false);
    expect(resultado.error).toBe('ESTADO_INVALIDO');
  });

  test('Inválida: detecta check-in duplicado y no permite registrarlo nuevamente', () => {
    const reserva = { id: 5, estado: 'PENDIENTE', checkin_registrado: true };

    const resultado = puedeRealizarCheckin(reserva);

    expect(resultado.puede).toBe(false);
    expect(resultado.error).toBe('CHECKIN_YA_REGISTRADO');
  });
});
