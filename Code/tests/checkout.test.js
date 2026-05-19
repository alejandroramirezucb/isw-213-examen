const {
  esSalidaTardia,
  calcularCargoLate,
  puedeRealizarCheckout,
} = require('../server/utils-calculos');

describe('HU-08: Registrar Check-Out con Late Check-Out', () => {
  test('Válida: registra check-out dentro del horario normal sin cargo adicional', () => {
    const estancia = {
      id: 1,
      timestamp_checkin: '2026-05-20T14:00:00Z',
      timestamp_checkout: null,
    };

    const puede = puedeRealizarCheckout(estancia);
    const esTardia = esSalidaTardia('11:00', '12:00');

    expect(puede.puede).toBe(true);
    expect(esTardia).toBe(false);
  });

  test('Límite: check-out exactamente a las 12:00 no genera cargo de late check-out', () => {
    const esTardia = esSalidaTardia('12:00', '12:00');

    expect(esTardia).toBe(false);
  });

  test('Inválida: no puede hacer check-out de reserva sin check-in previo', () => {
    const estancia = { id: 2, timestamp_checkin: null, timestamp_checkout: null };

    const resultado = puedeRealizarCheckout(estancia);

    expect(resultado.puede).toBe(false);
    expect(resultado.error).toBe('ESTANCIA_NO_ENCONTRADA');
  });

  test('Inválida: check-out después de las 12:00 genera cargo de late check-out', () => {
    const esTardia = esSalidaTardia('14:30', '12:00');
    const minutosRetraso = (14 * 60 + 30) - (12 * 60);
    const cargo = calcularCargoLate(minutosRetraso, 20);

    expect(esTardia).toBe(true);
    expect(cargo).toBeGreaterThan(0);
  });
});
