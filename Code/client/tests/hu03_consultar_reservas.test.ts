import { ordenarPorFechaIngreso, Reserva } from '../utiles/OrdenadorReservas';

describe('HU-03 Consultar reservas - AC-2: Ordenamiento cronológico', () => {

  describe('Ordenamiento correcto', () => {
    it('debe ordenar 3 reservas en orden ascendente', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 2, estado: 'ACTIVA', notas: null },
        { id: 2, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'PENDIENTE', notas: null },
        { id: 3, fecha_checkin: '2026-05-30', fecha_checkout: '2026-06-01', cantidad_personas: 3, estado: 'ACTIVA', notas: null },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(2);
      expect(resultado[1].id).toBe(1);
      expect(resultado[2].id).toBe(3);
    });

    it('debe mantener orden si ya está ordenado', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-15', fecha_checkout: '2026-05-17', cantidad_personas: 1, estado: 'PENDIENTE' },
        { id: 2, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 2, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(2);
      expect(resultado[2].id).toBe(3);
    });

    it('debe ordenar con muchas reservas', () => {
      const reservas: Reserva[] = [
        { id: 9, fecha_checkin: '2026-06-05', fecha_checkout: '2026-06-07', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-05-15', fecha_checkout: '2026-05-17', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 8, fecha_checkin: '2026-06-03', fecha_checkout: '2026-06-05', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 1, fecha_checkin: '2026-05-10', fecha_checkout: '2026-05-12', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 7, fecha_checkin: '2026-06-01', fecha_checkout: '2026-06-03', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 4, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 6, fecha_checkin: '2026-05-30', fecha_checkout: '2026-06-01', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 5, fecha_checkin: '2026-05-28', fecha_checkout: '2026-05-30', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 10, fecha_checkin: '2026-06-10', fecha_checkout: '2026-06-12', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);
      const idsOrdenados = resultado.map((r) => r.id);

      expect(idsOrdenados).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('debe ordenar con formato ISO 8601', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-25T14:30:00Z', fecha_checkout: '2026-05-27T10:00:00Z', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-05-20T08:00:00Z', fecha_checkout: '2026-05-22T12:00:00Z', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(2);
      expect(resultado[1].id).toBe(1);
    });

    it('debe retornar nuevo array sin mutar original', () => {
      const reservas: Reserva[] = [
        { id: 2, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 1, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado).not.toBe(reservas);
      expect(reservas[0].id).toBe(2);
      expect(resultado[0].id).toBe(1);
    });
  });

  describe('Casos límite', () => {
    it('debe retornar array vacío si entrada es null', () => {
      const resultado = ordenarPorFechaIngreso(null as any);
      expect(resultado).toEqual([]);
    });

    it('debe retornar array vacío si entrada es undefined', () => {
      const resultado = ordenarPorFechaIngreso(undefined as any);
      expect(resultado).toEqual([]);
    });

    it('debe retornar array vacío si lista está vacía', () => {
      const resultado = ordenarPorFechaIngreso([]);
      expect(resultado).toEqual([]);
    });

    it('debe manejar lista con un elemento', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado.length).toBe(1);
      expect(resultado[0].id).toBe(1);
    });

    it('debe manejar dos elementos', () => {
      const reservas: Reserva[] = [
        { id: 2, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 1, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(2);
    });
  });

  describe('Fechas idénticas', () => {
    it('debe mantener orden estable cuando fechas son iguales', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(1);
      expect(resultado[1].id).toBe(2);
      expect(resultado[2].id).toBe(3);
    });

    it('debe ordenar cuando fechas iguales están intercaladas', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-05-30', fecha_checkout: '2026-06-01', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 4, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(2);
      expect(resultado[1].id).toBe(3);
      expect(resultado[2].id).toBe(4);
      expect(resultado[3].id).toBe(1);
    });
  });

  describe('Años y meses diferentes', () => {
    it('debe ordenar con años diferentes', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2025-12-25', fecha_checkout: '2025-12-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-01-01', fecha_checkout: '2026-01-03', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2024-12-31', fecha_checkout: '2025-01-02', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].fecha_checkin).toBe('2024-12-31');
      expect(resultado[1].fecha_checkin).toBe('2025-12-25');
      expect(resultado[2].fecha_checkin).toBe('2026-01-01');
    });

    it('debe ordenar con meses diferentes en mismo año', () => {
      const reservas: Reserva[] = [
        { id: 1, fecha_checkin: '2026-10-15', fecha_checkout: '2026-10-17', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 2, fecha_checkin: '2026-02-10', fecha_checkout: '2026-02-12', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 3, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[0].id).toBe(2);
      expect(resultado[1].id).toBe(3);
      expect(resultado[2].id).toBe(1);
    });
  });

  describe('Preservación de datos', () => {
    it('debe preservar todos los campos durante ordenamiento', () => {
      const reservas: Reserva[] = [
        {
          id: 2,
          fecha_checkin: '2026-05-25',
          fecha_checkout: '2026-05-27',
          cantidad_personas: 2,
          estado: 'ACTIVA',
          notas: 'Aniversario',
          habitacion: { id: 101, numero_habitacion: '201' },
        },
        {
          id: 1,
          fecha_checkin: '2026-05-20',
          fecha_checkout: '2026-05-22',
          cantidad_personas: 1,
          estado: 'PENDIENTE',
          notas: null,
          habitacion: undefined,
        },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);
      const primeraReserva = resultado[0];

      expect(primeraReserva.id).toBe(1);
      expect(primeraReserva.fecha_checkin).toBe('2026-05-20');
      expect(primeraReserva.fecha_checkout).toBe('2026-05-22');
      expect(primeraReserva.cantidad_personas).toBe(1);
      expect(primeraReserva.estado).toBe('PENDIENTE');
      expect(primeraReserva.notas).toBeNull();
      expect(primeraReserva.habitacion).toBeUndefined();
    });

    it('debe preservar notas con caracteres especiales', () => {
      const reservas: Reserva[] = [
        {
          id: 2,
          fecha_checkin: '2026-05-25',
          fecha_checkout: '2026-05-27',
          cantidad_personas: 1,
          estado: 'ACTIVA',
          notas: 'Notas con "comillas" y caracteres: @#$%',
        },
        {
          id: 1,
          fecha_checkin: '2026-05-20',
          fecha_checkout: '2026-05-22',
          cantidad_personas: 1,
          estado: 'ACTIVA',
          notas: null,
        },
      ];

      const resultado = ordenarPorFechaIngreso(reservas);

      expect(resultado[1].notas).toBe('Notas con "comillas" y caracteres: @#$%');
    });
  });

  describe('Performance', () => {
    it('debe ordenar lista grande sin problemas', () => {
      const reservas: Reserva[] = Array.from({ length: 100 }, (_, i) => {
        const daysToAdd = Math.floor(Math.random() * 300);
        const date = new Date(2026, 4, 1);
        date.setDate(date.getDate() + daysToAdd);

        return {
          id: i + 1,
          fecha_checkin: date.toISOString().split('T')[0],
          fecha_checkout: new Date(date.getTime() + 86400000).toISOString().split('T')[0],
          cantidad_personas: 1,
          estado: 'ACTIVA',
        };
      });

      const resultado = ordenarPorFechaIngreso(reservas);

      for (let i = 1; i < resultado.length; i++) {
        const prev = new Date(resultado[i - 1].fecha_checkin).getTime();
        const curr = new Date(resultado[i].fecha_checkin).getTime();
        expect(prev).toBeLessThanOrEqual(curr);
      }
    });

    it('debe ser función pura sin efectos secundarios', () => {
      const reservas: Reserva[] = [
        { id: 2, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 1, estado: 'ACTIVA' },
        { id: 1, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'ACTIVA' },
      ];

      const resultado1 = ordenarPorFechaIngreso(reservas);
      const resultado2 = ordenarPorFechaIngreso(reservas);
      const resultado3 = ordenarPorFechaIngreso(reservas);

      expect(resultado1).toEqual(resultado2);
      expect(resultado2).toEqual(resultado3);
      expect(reservas[0].id).toBe(2);
    });
  });

  describe('Integración', () => {
    it('debe retornar reservas ordenadas para mostrar en lista', () => {
      const respuestaAPI: Reserva[] = [
        { id: 3, fecha_checkin: '2026-05-30', fecha_checkout: '2026-06-01', cantidad_personas: 2, estado: 'ACTIVA' },
        { id: 1, fecha_checkin: '2026-05-20', fecha_checkout: '2026-05-22', cantidad_personas: 1, estado: 'PENDIENTE' },
        { id: 2, fecha_checkin: '2026-05-25', fecha_checkout: '2026-05-27', cantidad_personas: 2, estado: 'ACTIVA' },
      ];

      const reservasOrdenadas = ordenarPorFechaIngreso(respuestaAPI);
      const idsEnPantalla = reservasOrdenadas.map((r) => r.id);

      expect(idsEnPantalla).toEqual([1, 2, 3]);
    });

    it('debe manejar lista vacía en integración', () => {
      const respuestaAPIVacia: Reserva[] = [];
      const resultado = ordenarPorFechaIngreso(respuestaAPIVacia);

      expect(resultado.length).toBe(0);
    });
  });
});
