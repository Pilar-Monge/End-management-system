import { expect, test } from '@playwright/test';
import { Client } from 'pg';

import { createDbClientFromEnv, loginAs, getUsersByAdminToken } from './helpers/e2e-support';

test.describe.serial('Intercamp Request - Auto-assign persons and rations', () => {
  let db: Client;
  let resourceToken = '';
  let resourceUserId = 0;

  test.beforeAll(async ({ request }) => {
    db = createDbClientFromEnv();
    await db.connect();

    resourceToken = await loginAs(request, 'resource_camp1', 1);

    const users = await getUsersByAdminToken(request, resourceToken);
    const resourceUser = users.find((u) => u.username === 'resource_camp1');
    expect(resourceUser).toBeTruthy();
    resourceUserId = resourceUser?.id ?? 0;
    expect(resourceUserId).toBeGreaterThan(0);
  });

  test.afterAll(async () => {
    await db.end();
  });

  test('approve request with personRequirements creates transfer and assigns people', async ({ request }) => {
    const res = await db.query<{ occupation_id: number; cnt: string }>(
      `SELECT occupation_id, COUNT(*)::text AS cnt
       FROM person p
       WHERE p.camp_id = $1 AND p.current_status = 'ACTIVE'
       GROUP BY occupation_id
       HAVING COUNT(*) >= 2
       ORDER BY COUNT(*) DESC
       LIMIT 1`,
      [1],
    );

    if (res.rowCount === 0) {
      test.skip(true, 'No occupation with >=2 active people in camp 1 to run this test');
      return;
    }

    const occupationId = res.rows[0].occupation_id;

    const createResp = await request.post('/api/intercamp-requests', {
      headers: { Authorization: `Bearer ${resourceToken}` },
      data: {
        originCampId: 1,
        destinationCampId: 2,
        status: 'PENDING',
        description: 'e2e-auto-assign-persons',
        createdBy: resourceUserId,
        personRequirements: [{ occupationId, quantity: 2 }],
      },
    });

    expect(createResp.status()).toBe(201);
    const createBody = (await createResp.json()) as any;
    const requestId = createBody.data?.id ?? 0;
    expect(requestId).toBeGreaterThan(0);

    const approveResp = await request.put(`/api/intercamp-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${resourceToken}` },
      data: { status: 'APPROVED' },
    });

    expect(approveResp.status()).toBe(200);

    const tRes = await db.query<{ id: number; rations_for_trip: string }>(
      `SELECT id, COALESCE(rations_for_trip::text, '0') AS rations_for_trip
       FROM transfer
       WHERE request_id = $1`,
      [requestId],
    );

    expect(tRes.rowCount).toBeGreaterThan(0);
    const transferId = tRes.rows[0].id;
    const rationsForTrip = parseFloat(tRes.rows[0].rations_for_trip);
    expect(transferId).toBeGreaterThan(0);
    expect(rationsForTrip).toBeGreaterThan(0);

    const tp = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM transfer_person WHERE transfer_id = $1`,
      [transferId],
    );

    expect(Number.parseInt(tp.rows[0].total, 10)).toBe(2);
  });
});
