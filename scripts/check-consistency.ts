import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkConsistency() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('--- Análisis de Consistencia User-Person ---');

    // 1. Usuarios sin person_id nulo
    const usersNullPerson = await client.query('SELECT id, username FROM "system_user" WHERE person_id IS NULL');
    console.log('Usuarios con person_id NULO:', usersNullPerson.rows);

    // 2. Usuarios con person_id que NO existe en la tabla person
    const usersOrphaned = await client.query('SELECT id, username, person_id FROM "system_user" WHERE person_id IS NOT NULL AND person_id NOT IN (SELECT id FROM person)');
    console.log('Usuarios con person_id HUÉRFANO (no existe en tabla person):', usersOrphaned.rows);

    // 3. Personas que no tienen un usuario vinculado
    const personsWithoutUser = await client.query('SELECT id, name, last_name1 FROM person WHERE id NOT IN (SELECT person_id FROM "system_user")');
    console.log('Personas sin Usuario vinculado:', personsWithoutUser.rows);

  } catch (err) {
    console.error('Error durante el análisis:', err);
  } finally {
    await client.end();
  }
}

checkConsistency();
