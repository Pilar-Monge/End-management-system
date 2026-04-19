import { expect, test } from '@playwright/test';
import { Client } from 'pg';

import { createDbClientFromEnv, getUsersByAdminToken, loginAs } from './helpers/e2e-support';

type InventoryMovementBody = {
  data?: {
    id?: number;
  };
};

type ExpeditionBody = {
  data?: {
    id?: number;
    campId?: number;
  };
};

test.describe.serial('Operational Notifications Without Email E2E', () => {
  let db: Client;
  let adminToken = '';
  let workerToken = '';
  let resourceToken = '';
  let travelToken = '';
  let workerUserId = 0;
  let workerCampId = 0;
  let resourceTypeId = 0;

  test.beforeAll(async ({ request }) => {
    db = createDbClientFromEnv();
    await db.connect();

    adminToken = await loginAs(request, 'admin_camp1', 1);
    workerToken = await loginAs(request, 'worker_camp1', 1);
    resourceToken = await loginAs(request, 'resource_camp1', 1);
    travelToken = await loginAs(request, 'travel_camp1', 1);

    const users = await getUsersByAdminToken(request, adminToken);
    const worker = users.find((u) => u.username === 'worker_camp1');
    expect(worker).toBeTruthy();
    workerUserId = worker?.id ?? 0;
    workerCampId = worker?.campId ?? 0;
    expect(workerUserId).toBeGreaterThan(0);
    expect(workerCampId).toBeGreaterThan(0);

    const resourceTypeRow = await db.query<{ id: number }>(
      'SELECT id FROM resource_type ORDER BY id ASC LIMIT 1',
    );
    expect(resourceTypeRow.rows.length).toBeGreaterThan(0);
    resourceTypeId = resourceTypeRow.rows[0].id;
  });

  test.afterAll(async () => {
    await db.end();
  });

  test('inventory movement update creates notification but does not queue email', async ({ request }) => {
    const uniqueTag = `${Date.now()}`;

    const createResponse = await request.post('/api/inventory-movements', {
      headers: {
        Authorization: `Bearer ${workerToken}`,
      },
      data: {
        campId: workerCampId,
        resourceTypeId,
        amount: '2',
        movementType: 'MANUAL_ADJUSTMENT',
        sourceType: 'E2E',
        recordedBy: workerUserId,
        description: `e2e-movement-create-${uniqueTag}`,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = (await createResponse.json()) as InventoryMovementBody;
    const movementId = createBody.data?.id ?? 0;
    expect(movementId).toBeGreaterThan(0);

    const beforeCount = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'inventory_alert'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(movementId)],
    );

    const updateResponse = await request.put(`/api/inventory-movements/${movementId}`, {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
      data: {
        description: `e2e-movement-update-${uniqueTag}`,
      },
    });

    expect(updateResponse.status()).toBe(200);

    const afterCount = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'inventory_alert'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(movementId)],
    );

    expect(Number.parseInt(afterCount.rows[0].total, 10)).toBe(
      Number.parseInt(beforeCount.rows[0].total, 10),
    );
  });

  test('expedition creation notifies in-app but does not queue expedition email', async ({ request }) => {
    const uniqueTag = `${Date.now()}`;

    const createResponse = await request.post('/api/expeditions', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
      data: {
        campId: 1,
        name: `e2e-expedition-${uniqueTag}`,
        objective: 'validar politica correo no operacional',
        destinationDescription: 'sector norte',
        estimatedDurationDays: 2,
        maxExtraDays: 1,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = (await createResponse.json()) as ExpeditionBody;
    const expeditionId = createBody.data?.id ?? 0;
    expect(expeditionId).toBeGreaterThan(0);

    const expeditionOutbox = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'expedition_created'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(expeditionId)],
    );

    expect(Number.parseInt(expeditionOutbox.rows[0].total, 10)).toBe(0);
  });

  test('visitor role stays blocked in operational modules', async ({ request }) => {
    const visitorToken = await loginAs(request, 'visitor_camp1', 1);

    const inventoryResponse = await request.get('/api/inventory-movements', {
      headers: {
        Authorization: `Bearer ${visitorToken}`,
      },
    });

    expect(inventoryResponse.status()).toBe(403);

    const expeditionResponse = await request.get('/api/expeditions', {
      headers: {
        Authorization: `Bearer ${visitorToken}`,
      },
    });

    expect(expeditionResponse.status()).toBe(403);
  });
});
