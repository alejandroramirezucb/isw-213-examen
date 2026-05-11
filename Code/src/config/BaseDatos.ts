import path from 'path';
import { DataSource } from 'typeorm';

const sslConfig =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, '../modelos/**/*.{ts,js}')],
  extra: { client_encoding: 'UTF-8' },
});
