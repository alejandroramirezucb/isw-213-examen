"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteApp = void 0;
const ts_results_1 = require("ts-results");
class ClienteApp {
    static base = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');
    static async peticion(ruta, metodo = 'GET', cuerpo) {
        const res = await fetch(`${ClienteApp.base}${ruta}`, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
        });
        if (!res.ok) {
            const json = await res.json();
            return (0, ts_results_1.Err)(json.error ?? 'Error desconocido');
        }
        return (0, ts_results_1.Ok)((await res.json()));
    }
}
exports.ClienteApp = ClienteApp;
