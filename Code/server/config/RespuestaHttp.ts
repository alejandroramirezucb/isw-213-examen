import { Result } from 'ts-results';
import { Response } from 'express';

export class RespuestaHttp<T = void> {
  constructor(private readonly resultado: Result<T, string>) {}

  enviar(res: Response, codigoExito = 200): void {
    if (this.resultado.err) {
      res.status(this.codigoError()).json({ error: this.resultado.val });
    } else {
      const valor = this.resultado.val === undefined ? { exito: true } : this.resultado.val;
      res.status(codigoExito).json(valor);
    }
  }

  private codigoError(): number {
    const error = this.resultado.val as string;
    
    if (error.includes('NO_ENCONTR')) {
      return 404;
    }
    if (error.includes('YA_')) {
      return 409;
    }

    return 400;
  }
}
