import { expect, test } from '@playwright/test';
import { Client } from 'pg';

import { createDbClientFromEnv, getUsersByAdminToken, loginAs } from './helpers/e2e-support';

type IntercampBody = {
  data?: {
    id?: number;
    status?: string;
  };
};

test.describe.serial('Intercamp Email Flow E2E', () => {
  let db: Client;
  let adminToken = '';
  let resourceToken = '';
  let resourceUserId = 0;
  let resourceEmail = '';

  test.beforeAll(async ({ request }) => {
    db = createDbClientFromEnv();
    await db.connect();

    adminToken = await loginAs(request, 'admin_camp1', 1);
    resourceToken = await loginAs(request, 'resource_camp1', 1);

    const users = await getUsersByAdminToken(request, adminToken);
    const resourceUser = users.find((u) => u.username === 'resource_camp1');
    expect(resourceUser).toBeTruthy();

    resourceUserId = resourceUser?.id ?? 0;
    resourceEmail = resourceUser?.email ?? '';
    expect(resourceUserId).toBeGreaterThan(0);
    expect(resourceEmail.length).toBeGreaterThan(3);
  });

  test.afterAll(async () => {
    await db.end();
  });

  test('create + approve request queues intercamp critical emails', async ({ request }) => {
    const uniqueTag = `${Date.now()}`;

    const createResponse = await request.post('/api/intercamp-requests', {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
      data: {
        originCampId: 1,
        destinationCampId: 2,
        status: 'PENDING',
        description: `e2e-intercamp-${uniqueTag}`,
        createdBy: resourceUserId,
      },
    });

    expect(createResponse.status()).toBe(201);
    const createBody = (await createResponse.json()) as IntercampBody;
    const requestId = createBody.data?.id ?? 0;
    expect(requestId).toBeGreaterThan(0);

    const receivedForCreator = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'intercamp_request_received'
         AND lower(to_email) = lower($1)
         AND COALESCE(payload->>'sourceId', '') = $2`,
      [resourceEmail, String(requestId)],
    );

    expect(Number.parseInt(receivedForCreator.rows[0].total, 10)).toBeGreaterThan(0);

    const receivedForDestinationCamp = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox e
       WHERE e.template_key = 'intercamp_request_received'
         AND COALESCE(e.payload->>'sourceId', '') = $1
         AND lower(e.to_email) <> lower($2)`,
      [String(requestId), resourceEmail],
    );

    expect(Number.parseInt(receivedForDestinationCamp.rows[0].total, 10)).toBeGreaterThan(0);

    const approveResponse = await request.put(`/api/intercamp-requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
      data: {
        status: 'APPROVED',
      },
    });

    expect(approveResponse.status()).toBe(200);

    const approveBody = (await approveResponse.json()) as IntercampBody;
    expect(approveBody.data?.status).toBe('APPROVED');

    const approvedOutbox = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'intercamp_request_approved'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(requestId)],
    );

    expect(Number.parseInt(approvedOutbox.rows[0].total, 10)).toBeGreaterThan(0);
  });

  test('worker cannot create intercamp request', async ({ request }) => {
    const workerToken = await loginAs(request, 'worker_camp1', 1);

    const response = await request.post('/api/intercamp-requests', {
      headers: {
        Authorization: `Bearer ${workerToken}`,
      },
      data: {
        originCampId: 1,
        destinationCampId: 2,
        status: 'PENDING',
        description: 'rbac-block-worker',
        createdBy: 2,
      },
    });

    expect(response.status()).toBe(403);
  });
});
