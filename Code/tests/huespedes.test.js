const {
  validarNombreMinimo,
  validarCamposHuesped,
  documentoYaRegistrado,
  registrarHuespedEnLista,
} = require('../server/utils-calculos');

describe('HU-01: Registrar Huésped', () => {
  test('Válida: registra huésped con todos los campos obligatorios correctamente', () => {
    const huespedes = [];
    const datos = {
      nombre: 'Carlos Mendoza',
      documento: '12345678',
      telefono: '72000001',
      correo: 'carlos@email.com',
    };

    const resultado = registrarHuespedEnLista(datos, huespedes);

    expect(resultado.ok).toBe(true);
    expect(resultado.huesped).toBeDefined();
    expect(resultado.huesped.documento).toBe('12345678');
    expect(huespedes).toHaveLength(1);
  });

  test('Límite: acepta nombre con exactamente 2 caracteres (mínimo permitido)', () => {
    const resultado = validarNombreMinimo('Al');

    expect(resultado).toBe(true);
  });

  test('Inválida: rechaza registro si falta el campo documento de identidad', () => {
    const datos = {
      nombre: 'Carlos Mendoza',
      documento: '',
      telefono: '72000001',
      correo: 'carlos@email.com',
    };

    const resultado = validarCamposHuesped(datos);

    expect(resultado.valido).toBe(false);
    expect(resultado.error.toLowerCase()).toContain('documento');
  });

  test('Inválida: impide registrar huésped con documento ya existente', () => {
    const huespedes = [
      { nombre: 'Ana Torres', documento: '12345678', telefono: '72000002', correo: 'ana@email.com' },
    ];
    const datosDuplicado = {
      nombre: 'Pedro Gomez',
      documento: '12345678',
      telefono: '72000003',
      correo: 'pedro@email.com',
    };

    const duplicado = documentoYaRegistrado('12345678', huespedes);
    const resultado = registrarHuespedEnLista(datosDuplicado, huespedes);

    expect(duplicado).toBe(true);
    expect(resultado.ok).toBe(false);
    expect(resultado.error.toLowerCase()).toContain('documento');
  });
});
