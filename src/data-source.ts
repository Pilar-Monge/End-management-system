import 'reflect-metadata';
import { DataSource } from 'typeorm';

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = Number(process.env.DB_PORT ?? '5432');
const dbUser = process.env.DB_USER ?? 'gestionfin';
const dbPassword = process.env.DB_PASSWORD ?? 'gestionfin123';
const dbName = process.env.DB_NAME ?? 'gestionfin_db';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
