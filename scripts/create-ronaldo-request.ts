
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createRequest() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const query = `
      INSERT INTO admission_request (
        name, 
        last_name1, 
        email, 
        desired_username, 
        birth_date, 
        gender, 
        camp_id, 
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      'Cristino',
      'Ronaldo',
      'edicsonpicadoq@gmail.com',
      'cr7_ronaldo',
      '1985-02-05',
      'MALE',
      2,
      'PENDING_AI'
    ];

    const res = await client.query(query, values);
    console.log('Admission request created with ID:', res.rows[0].id);

  } catch (err) {
    console.error('Error creating request:', err);
  } finally {
    await client.end();
  }
}

createRequest();
