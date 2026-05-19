const {
  filtrarActivasYFuturas,
  ordenarPorFechaIngreso,
  mensajeListadoVacio,
} = require('../server/utils-calculos');

describe('HU-03: Consultar Reservas Activas y Futuras', () => {
  test('Válida: muestra reservas activas y futuras ordenadas cronológicamente', () => {
    const hoy = '2026-05-18';
    const reservas = [
      { id: 1, estado: 'ACTIVA', fecha_checkin: '2026-05-18', fecha_checkout: '2026-05-20' },
      { id: 2, estado: 'PENDIENTE', fecha_checkin: '2026-06-01', fecha_checkout: '2026-06-05' },
      { id: 3, estado: 'PENDIENTE', fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-28' },
    ];

    const filtradas = filtrarActivasYFuturas(reservas, hoy);
    const ordenadas = ordenarPorFechaIngreso(filtradas);

    expect(ordenadas).toHaveLength(3);
    expect(new Date(ordenadas[0].fecha_checkin) <= new Date(ordenadas[1].fecha_checkin)).toBe(true);
    expect(new Date(ordenadas[1].fecha_checkin) <= new Date(ordenadas[2].fecha_checkin)).toBe(true);
  });

  test('Límite: reserva con fecha de ingreso igual a hoy aparece en el listado', () => {
    const hoy = '2026-05-18';
    const reservas = [
      { id: 1, estado: 'PENDIENTE', fecha_checkin: '2026-05-18', fecha_checkout: '2026-05-20' },
    ];

    const filtradas = filtrarActivasYFuturas(reservas, hoy);

    expect(filtradas).toHaveLength(1);
    expect(filtradas[0].id).toBe(1);
  });

  test('Inválida: reservas canceladas no aparecen en el listado de activas y futuras', () => {
    const hoy = '2026-05-18';
    const reservas = [
      { id: 1, estado: 'CANCELADA', fecha_checkin: '2026-05-30', fecha_checkout: '2026-06-02' },
    ];

    const filtradas = filtrarActivasYFuturas(reservas, hoy);

    expect(filtradas).toHaveLength(0);
  });

  test('Inválida: muestra mensaje cuando no hay reservas disponibles', () => {
    const mensaje = mensajeListadoVacio([]);

    expect(mensaje).toBe('No hay reservas disponibles');
  });
});
