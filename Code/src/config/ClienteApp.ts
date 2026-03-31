import { Ok, Err, Result } from 'ts-results';

export class ClienteApp {
  private static readonly base = '/api';

  static async peticion<T>(
    ruta: string,
    metodo = 'GET',
    cuerpo?: unknown,
  ): Promise<Result<T, string>> {
    const res = await fetch(`${ClienteApp.base}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
    if (!res.ok) {
      const json = await res.json();
      return Err(json.error ?? 'Error desconocido');
    }
    return Ok((await res.json()) as T);
  }
}
