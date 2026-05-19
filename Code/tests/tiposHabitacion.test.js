const {
  obtenerCaracteristicasTipo,
  listarVariacionesActivas,
  validarVariacionSeleccionada,
  variacionesDistintas,
} = require('../server/utils-calculos');

describe('HU-05: Gestionar Variación de Tipo de Habitación', () => {
  test('Válida: seleccionar Suite asigna características base automáticamente', () => {
    const caracteristicas = obtenerCaracteristicasTipo('Suite');

    expect(caracteristicas).not.toBeNull();
    expect(caracteristicas.nombre).toBe('Suite');
    expect(caracteristicas.capacidad_maxima).toBeDefined();
    expect(caracteristicas.descripcion).toBeDefined();
  });

  test('Límite: las 4 variaciones disponibles tienen características distintas entre sí', () => {
    const tipos = [
      obtenerCaracteristicasTipo('Simple'),
      obtenerCaracteristicasTipo('Suite'),
      obtenerCaracteristicasTipo('Doble Individual'),
      obtenerCaracteristicasTipo('Doble Matrimonial'),
    ];

    expect(tipos.every(t => t !== null)).toBe(true);
    const nombres = tipos.map(t => t.nombre);
    const nombresUnicos = new Set(nombres);
    expect(nombresUnicos.size).toBe(4);
  });

  test('Inválida: rechaza guardar reserva sin seleccionar una variación válida', () => {
    const sinSeleccion = validarVariacionSeleccionada(null);
    const vacia = validarVariacionSeleccionada('');

    expect(sinSeleccion).toBe(false);
    expect(vacia).toBe(false);
  });

  test('Inválida: variación inactiva no aparece en el listado de opciones disponibles', () => {
    const variaciones = [
      { nombre: 'Simple', activo: true },
      { nombre: 'Suite', activo: true },
      { nombre: 'Suite Premium', activo: false },
    ];

    const activas = listarVariacionesActivas(variaciones);

    expect(activas).toHaveLength(2);
    expect(activas.find(v => v.nombre === 'Suite Premium')).toBeUndefined();
  });
});
