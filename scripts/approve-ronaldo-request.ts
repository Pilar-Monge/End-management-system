
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function approveRequest() {
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
    console.log('Connected to database');

    const requestId = 77;
    const campId = 2;

    // 1. Get request details
    const reqRes = await client.query('SELECT * FROM "admission_request" WHERE "id" = $1', [requestId]);
    if (reqRes.rows.length === 0) throw new Error('Request not found');
    const request = reqRes.rows[0];

    // 2. Get an admin from camp 2
    const adminRes = await client.query('SELECT "id" FROM "system_user" WHERE "camp_id" = $1 AND "role" = $2 LIMIT 1', [campId, 'SYSTEM_ADMIN']);
    if (adminRes.rows.length === 0) throw new Error('Admin not found in camp 2');
    const adminId = adminRes.rows[0].id;

    // 3. Get an occupation
    const occRes = await client.query('SELECT "id" FROM "occupation" LIMIT 1');
    if (occRes.rows.length === 0) throw new Error('No occupations found');
    const occupationId = occRes.rows[0].id;

    console.log(`Approving request ${requestId} using admin ${adminId} and occupation ${occupationId}`);

    // Start Transaction
    await client.query('BEGIN');

    // 4. Create Person
    const personQuery = `
      INSERT INTO "person" (
        "name", "last_name1", "identification_number", "birth_date", "gender", 
        "current_status", "camp_id", "admission_request_id", "occupation_id"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING "id";
    `;
    const personValues = [
      request.name, request.last_name1, 'CR7-PORT-001', request.birth_date, request.gender,
      'ACTIVE', campId, requestId, occupationId
    ];
    const personRes = await client.query(personQuery, personValues);
    const personId = personRes.rows[0].id;

    // 5. Create System User
    const passwordHash = await bcrypt.hash('Ronaldo2026!', 10);
    const userQuery = `
      INSERT INTO "system_user" (
        "username", "email", "password_hash", "role", "status", "camp_id", "person_id", "request_id"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING "id";
    `;
    const userValues = [
      request.desired_username, request.email, passwordHash, 'WORKER', 'ACTIVE', 
      campId, personId, requestId
    ];
    await client.query(userQuery, userValues);

    // 6. Update Request Status
    await client.query(
      'UPDATE "admission_request" SET "status" = $1, "reviewed_by" = $2, "review_date" = NOW() WHERE "id" = $3',
      ['APPROVED', adminId, requestId]
    );

    await client.query('COMMIT');
    console.log('Request approved successfully. Person and User created.');
    console.log(`Credentials: Username: ${request.desired_username}, Password: Ronaldo2026!`);

  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Error approving request:', err);
  } finally {
    await client.end();
  }
}

approveRequest();
