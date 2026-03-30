import express, { Express, NextFunction, Request, Response } from 'express';
import { AppDataSource } from './BaseDatos';
import rutasCancelacion from '../rutas/RouterCancelacion';
import rutasContactoServicio from '../rutas/RouterContactoServicio';
import rutasEstancia from '../rutas/RouterEstancia';
import rutasHabitacion from '../rutas/RouterHabitacion';
import rutasHuesped from '../rutas/RouterHuesped';
import rutasReserva from '../rutas/RouterReserva';
import rutasReservaHuesped from '../rutas/RouterReservaHuesped';
import rutasTipoHabitacion from '../rutas/RouterTipoHabitacion';
import rutasUsuario from '../rutas/RouterUsuario';

export class ServidorApp {
  private app: Express = express();
  private readonly puerto = 5000;

  constructor() {
    this.configurarMiddleware();
    this.configurarRutas();
  }

  private configurarMiddleware(): void {
    this.app.use(express.json());
    this.app.use(this.cors);
  }

  private cors = (_req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };

  private configurarRutas(): void {
    this.app.use('/api/huesped', rutasHuesped);
    this.app.use('/api/habitacion', rutasHabitacion);
    this.app.use('/api/tipo-habitacion', rutasTipoHabitacion);
    this.app.use('/api/reserva', rutasReserva);
    this.app.use('/api/reserva', rutasReservaHuesped);
    this.app.use('/api/estancia', rutasEstancia);
    this.app.use('/api/contacto-servicio', rutasContactoServicio);
    this.app.use('/api/usuario', rutasUsuario);
    this.app.use('/api/cancelacion', rutasCancelacion);
    this.app.get('/api/health', (_req, res) => res.json({ ok: true }));
  }

  async iniciar(): Promise<void> {
    await AppDataSource.initialize();
    this.app.listen(this.puerto);
  }
}
