import 'reflect-metadata';
import { DataSource } from 'typeorm';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} environment variable is required`);
  }

  return value.trim();
}

const dbHost = requiredEnv('DB_HOST');
const dbPortValue = requiredEnv('DB_PORT');
const dbPort = Number(dbPortValue);

if (Number.isNaN(dbPort)) {
  throw new Error('DB_PORT environment variable must be a valid number');
}

const dbUser = requiredEnv('DB_USER');
const dbPassword = requiredEnv('DB_PASSWORD');
const dbName = requiredEnv('DB_NAME');

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
