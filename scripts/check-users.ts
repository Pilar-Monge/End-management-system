
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
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
    const users = await client.query('SELECT id, username, email, person_id FROM "system_user" WHERE camp_id = 2');
    console.log('Users in Camp 2:', users.rows);
  } finally {
    await client.end();
  }
}

checkUsers();
