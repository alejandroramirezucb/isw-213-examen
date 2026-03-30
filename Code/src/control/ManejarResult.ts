import { Result } from 'ts-results';
import { Response } from 'express';

export type Respuesta<T = void> =
  | { ok: true; datos: T }
  | { ok: false; error: string };

export function manejarResult<T>(resultado: Result<T, string>): Respuesta<T> {
  if (resultado.err) {
    return { ok: false, error: resultado.val };
  }
  return { ok: true, datos: resultado.val };
}

function codigoError(error: string): number {
  if (error.includes('NO_ENCONTR')) {
    return 404;
  }
  if (error.includes('YA_')) {
    return 409;
  }
  return 400;
}

export function enviar<T>(
  res: Response,
  respuesta: Respuesta<T>,
  codigoExito = 200,
){
  if (respuesta.ok) {
    res.status(codigoExito).json(respuesta.datos);
  } else {
    res.status(codigoError(respuesta.error)).json({ error: respuesta.error });
  }
}
