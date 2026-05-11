import express, { Express, NextFunction, Request, Response } from 'express';
import { AppDataSource } from './BaseDatos';
import rutasCancelacion from '../rutas/RutaCancelacion';
import rutasConfiguracion from '../rutas/RutaConfiguracion';
import rutasContactoServicio from '../rutas/RutaContactoServicio';
import rutasEstancia from '../rutas/RutaEstancia';
import rutasHabitacion from '../rutas/RutaHabitacion';
import rutasHuesped from '../rutas/RutaHuesped';
import rutasReserva from '../rutas/RutaReserva';
import rutasTipoHabitacion from '../rutas/RutaTipoHabitacion';
import rutasUsuario from '../rutas/RutaUsuario';

export class ServidorApp {
  private app: Express = express();
  private readonly puerto = Number(process.env.PORT ?? 5001);

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
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };

  private configurarRutas(): void {
    this.app.get('/api', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', message: 'API disponible' });
    });

    this.app.use('/api/huesped', rutasHuesped);
    this.app.use('/api/habitacion', rutasHabitacion);
    this.app.use('/api/tipo-habitacion', rutasTipoHabitacion);
    this.app.use('/api/reserva', rutasReserva);
    this.app.use('/api/estancia', rutasEstancia);
    this.app.use('/api/contacto-servicio', rutasContactoServicio);
    this.app.use('/api/usuario', rutasUsuario);
    this.app.use('/api/cancelacion', rutasCancelacion);
    this.app.use('/api/configuracion', rutasConfiguracion);
  }

  async iniciar(): Promise<void> {
    await AppDataSource.initialize();
    this.app.listen(this.puerto);
  }
}
