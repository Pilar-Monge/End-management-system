
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function fixConstraint() {
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

    // 1. Eliminar el constraint antiguo
    console.log('Dropping old constraint...');
    await client.query('ALTER TABLE notification DROP CONSTRAINT IF EXISTS chk_notificacion_tipo');

    // 2. Crear el nuevo constraint incluyendo los nuevos tipos
    console.log('Creating new constraint with TEMPORARY_OCCUPATION_REVOKED...');
    const query = `
      ALTER TABLE notification 
      ADD CONSTRAINT chk_notificacion_tipo 
      CHECK (type IN (
        'ADMISSION_REQUEST_PENDING',
        'ADMISSION_REQUEST_APPROVED',
        'ADMISSION_REQUEST_REJECTED',
        'ADMISSION_REQUEST_AI_REVIEWED',
        'ROLE_UPDATED',
        'USER_STATUS_UPDATED',
        'INVENTORY_ALERT',
        'OVERPOPULATION_ALERT',
        'INTERCAMP_REQUEST_RECEIVED',
        'INTERCAMP_REQUEST_APPROVED',
        'INTERCAMP_REQUEST_REJECTED',
        'INTERCAMP_REQUEST_CANCELED',
        'EXPEDITION_RETURN',
        'EXPEDITION_STATUS_UPDATED',
        'EXPEDITION_CREATED',
        'EXPEDITION_COMPLETED',
        'EXPEDITION_RESOURCE_CONSUMED',
        'EXPEDITION_RESOURCE_OBTAINED',
        'TRANSFER_PENDING',
        'TRANSFER_COMPLETED',
        'TRANSFER_CANCELED',
        'TRANSFER_EXECUTION_FAILED',
        'TRANSFER_PERSON_UPDATED',
        'REQUEST_PERSON_DETAIL_UPDATED',
        'REQUEST_RESOURCE_DETAIL_UPDATED',
        'TRANSFER_RESOURCE_RECORDED',
        'PERSON_STATUS_CHANGED',
        'PASSWORD_RESET_REQUESTED',
        'PASSWORD_RESET_COMPLETED',
        'OCCUPATION_WITHOUT_STAFF',
        'TEMPORARY_OCCUPATION_ASSIGNED',
        'TEMPORARY_OCCUPATION_REVOKED',
        'CAMP_ACHIEVEMENT_UNLOCKED'
      ));
    `;
    await client.query(query);
    console.log('Constraint updated successfully!');

  } catch (err) {
    console.error('Error fixing constraint:', err);
  } finally {
    await client.end();
  }
}

fixConstraint();
