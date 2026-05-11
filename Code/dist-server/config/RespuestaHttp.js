"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespuestaHttp = void 0;
class RespuestaHttp {
    resultado;
    constructor(resultado) {
        this.resultado = resultado;
    }
    enviar(res, codigoExito = 200) {
        if (this.resultado.err) {
            res.status(this.codigoError()).json({ error: this.resultado.val });
        }
        else {
            const valor = this.resultado.val === undefined ? { exito: true } : this.resultado.val;
            res.status(codigoExito).json(valor);
        }
    }
    codigoError() {
        const error = this.resultado.val;
        if (error.includes('NO_ENCONTR')) {
            return 404;
        }
        if (error.includes('YA_')) {
            return 409;
        }
        return 400;
    }
}
exports.RespuestaHttp = RespuestaHttp;
