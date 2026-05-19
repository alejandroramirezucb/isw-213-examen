const {
  formatearTelefono,
  formatearContacto,
  listarContactos,
  mensajeContactosVacio,
} = require('../server/utils-calculos');

describe('HU-06: Visualizar Contactos de Servicios del Hotel', () => {
  test('Válida: muestra 4 contactos con nombre del servicio, encargado y teléfono', () => {
    const contactosBD = [
      { nombre: 'Servicio de Limpieza', encargado: 'María López', telefono: '70000001' },
      { nombre: 'Mantenimiento', encargado: 'Pedro Ríos', telefono: '70000002' },
      { nombre: 'Cocina', encargado: 'Julia Vargas', telefono: '70000003' },
      { nombre: 'Seguridad', encargado: 'Luis Pérez', telefono: '70000004' },
    ];

    const resultado = listarContactos(contactosBD);

    expect(resultado).toHaveLength(4);
    resultado.forEach(c => {
      expect(c.nombre).toBeDefined();
      expect(c.encargado).toBeDefined();
      expect(c.telefono).toBeDefined();
    });
  });

  test('Límite: muestra correctamente un único contacto registrado sin errores', () => {
    const contactosBD = [
      { nombre: 'Servicio de Limpieza', encargado: 'María López', telefono: '70000001' },
    ];

    const resultado = listarContactos(contactosBD);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Servicio de Limpieza');
  });

  test('Inválida: contacto sin teléfono muestra "No disponible" en lugar de error', () => {
    const resultado = formatearTelefono(null);

    expect(resultado).toBe('No disponible');
  });

  test('Inválida: muestra mensaje apropiado cuando no hay contactos registrados', () => {
    const mensaje = mensajeContactosVacio([]);

    expect(mensaje).toBe('No hay contactos disponibles');
  });
});
