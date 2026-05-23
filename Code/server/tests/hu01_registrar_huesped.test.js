const { documentoYaRegistrado } = require('../utils-calculos.js');

describe('HU-01 Registrar huésped - AC-3: Prevenir duplicado', () => {

  describe('Documento encontrado', () => {
    it('debe retornar true cuando documento existe', () => {
      const documento = '87654321';
      const lista = [
        { id: 1, documento: '12345678', nombre: 'Juan' },
        { id: 2, documento: '87654321', nombre: 'María' },
        { id: 3, documento: '11111111', nombre: 'Carlos' },
      ];

      const resultado = documentoYaRegistrado(documento, lista);

      expect(resultado).toBe(true);
      expect(typeof resultado).toBe('boolean');
    });

    it('debe encontrar documento en primera posición', () => {
      const documento = '11111111';
      const lista = [
        { id: 1, documento: '11111111', nombre: 'Primero' },
        { id: 2, documento: '22222222', nombre: 'Segundo' },
      ];

      expect(documentoYaRegistrado(documento, lista)).toBe(true);
    });

    it('debe encontrar documento en última posición', () => {
      const documento = '33333333';
      const lista = [
        { id: 1, documento: '11111111', nombre: 'Primero' },
        { id: 2, documento: '22222222', nombre: 'Segundo' },
        { id: 3, documento: '33333333', nombre: 'Último' },
      ];

      expect(documentoYaRegistrado(documento, lista)).toBe(true);
    });

    it('debe encontrar documento con lista de un elemento', () => {
      const documento = '99999999';
      const lista = [{ id: 1, documento: '99999999', nombre: 'Único' }];

      expect(documentoYaRegistrado(documento, lista)).toBe(true);
    });
  });

  describe('Documento no encontrado', () => {
    it('debe retornar false cuando documento no existe', () => {
      const documento = '99999999';
      const lista = [
        { id: 1, documento: '12345678', nombre: 'Juan' },
        { id: 2, documento: '87654321', nombre: 'María' },
      ];

      const resultado = documentoYaRegistrado(documento, lista);

      expect(resultado).toBe(false);
      expect(typeof resultado).toBe('boolean');
    });

    it('debe retornar false con lista vacía', () => {
      const documento = '12345678';
      const lista = [];

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando documentos son diferentes', () => {
      const documento = '00000000';
      const lista = [
        { id: 1, documento: '11111111' },
        { id: 2, documento: '22222222' },
        { id: 3, documento: '33333333' },
      ];

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });
  });

  describe('Validación de entrada', () => {
    it('debe retornar false cuando lista es null', () => {
      const documento = '12345678';
      const lista = null;

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando lista es undefined', () => {
      const documento = '12345678';
      const lista = undefined;

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando lista no es array - objeto', () => {
      const documento = '12345678';
      const lista = { 0: { documento: '12345678' } };

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando lista no es array - string', () => {
      const documento = '12345678';
      const lista = '12345678';

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando lista no es array - número', () => {
      const documento = '12345678';
      const lista = 123;

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });

    it('debe retornar false cuando lista no es array - booleano', () => {
      const documento = '12345678';
      const lista = true;

      expect(documentoYaRegistrado(documento, lista)).toBe(false);
    });
  });

  describe('Formato de documento', () => {
    it('debe diferenciar por case sensitive', () => {
      const lista = [{ id: 1, documento: 'ABC123XYZ', nombre: 'Juan' }];

      expect(documentoYaRegistrado('ABC123XYZ', lista)).toBe(true);
      expect(documentoYaRegistrado('abc123xyz', lista)).toBe(false);
      expect(documentoYaRegistrado('Abc123Xyz', lista)).toBe(false);
    });

    it('debe manejar documentos con espacios como diferente', () => {
      const lista = [{ id: 1, documento: '12345678', nombre: 'Juan' }];

      expect(documentoYaRegistrado('12345678', lista)).toBe(true);
      expect(documentoYaRegistrado(' 12345678', lista)).toBe(false);
      expect(documentoYaRegistrado('12345678 ', lista)).toBe(false);
      expect(documentoYaRegistrado(' 12345678 ', lista)).toBe(false);
    });

    it('debe manejar documentos con caracteres especiales', () => {
      const lista = [
        { id: 1, documento: '123-456-789', nombre: 'Con guiones' },
        { id: 2, documento: 'ID-2024-5000', nombre: 'Con letras' },
        { id: 3, documento: 'DOC.2024.001', nombre: 'Con puntos' },
      ];

      expect(documentoYaRegistrado('123-456-789', lista)).toBe(true);
      expect(documentoYaRegistrado('ID-2024-5000', lista)).toBe(true);
      expect(documentoYaRegistrado('DOC.2024.001', lista)).toBe(true);
      expect(documentoYaRegistrado('123456789', lista)).toBe(false);
    });

    it('debe manejar documentos numéricos como strings', () => {
      const lista = [{ id: 1, documento: '98765432', nombre: 'Numérico' }];

      expect(documentoYaRegistrado('98765432', lista)).toBe(true);
    });

    it('debe manejar strings vacíos', () => {
      const lista = [
        { id: 1, documento: '', nombre: 'Vacío' },
        { id: 2, documento: '12345678', nombre: 'Normal' },
      ];

      expect(documentoYaRegistrado('', lista)).toBe(true);
      expect(documentoYaRegistrado('otros', lista)).toBe(false);
    });
  });

  describe('Integración - Flujo real', () => {
    it('debe permitir registro de nuevo huésped sin duplicado', () => {
      const listaActual = [{ id: 1, documento: '12345678', nombre: 'Cliente Actual' }];
      const nuevoDocumento = '87654321';

      const esDocumentoDuplicado = documentoYaRegistrado(nuevoDocumento, listaActual);

      expect(esDocumentoDuplicado).toBe(false);
    });

    it('debe rechazar intento de registro con documento duplicado', () => {
      const listaActual = [{ id: 1, documento: '12345678', nombre: 'Juan Pérez' }];
      const documentoIntentado = '12345678';

      const esDocumentoDuplicado = documentoYaRegistrado(documentoIntentado, listaActual);

      expect(esDocumentoDuplicado).toBe(true);
    });

    it('debe manejar múltiples intentos fallidos', () => {
      const lista = [
        { id: 1, documento: '11111111' },
        { id: 2, documento: '22222222' },
        { id: 3, documento: '33333333' },
      ];

      expect(documentoYaRegistrado('11111111', lista)).toBe(true);
      expect(documentoYaRegistrado('22222222', lista)).toBe(true);
      expect(documentoYaRegistrado('33333333', lista)).toBe(true);
      expect(documentoYaRegistrado('44444444', lista)).toBe(false);
    });
  });

  describe('Performance y estabilidad', () => {
    it('debe manejar lista grande sin problemas', () => {
      const listaGrande = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        documento: `DOC-${String(i + 1).padStart(6, '0')}`,
        nombre: `Huésped ${i + 1}`,
      }));

      expect(documentoYaRegistrado('DOC-000001', listaGrande)).toBe(true);
      expect(documentoYaRegistrado('DOC-000500', listaGrande)).toBe(true);
      expect(documentoYaRegistrado('DOC-001000', listaGrande)).toBe(true);
      expect(documentoYaRegistrado('DOC-999999', listaGrande)).toBe(false);
    });

    it('debe retornar resultado consistente - función pura', () => {
      const lista = [{ id: 1, documento: '12345' }];
      const documento = '12345';

      const r1 = documentoYaRegistrado(documento, lista);
      const r2 = documentoYaRegistrado(documento, lista);
      const r3 = documentoYaRegistrado(documento, lista);

      expect(r1).toBe(r2);
      expect(r2).toBe(r3);
      expect(r1).toBe(true);
    });

    it('no debe modificar la lista original', () => {
      const listaOriginal = [{ id: 1, documento: '11111111', nombre: 'Juan' }];
      const copiaParaComparar = JSON.stringify(listaOriginal);

      documentoYaRegistrado('99999999', listaOriginal);

      expect(JSON.stringify(listaOriginal)).toBe(copiaParaComparar);
    });
  });
});
