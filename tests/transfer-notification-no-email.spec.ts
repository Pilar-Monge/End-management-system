import { expect, test } from '@playwright/test';
import { Client } from 'pg';

import { createDbClientFromEnv, loginAs } from './helpers/e2e-support';

type TransferBody = {
  data?: {
    id?: number;
    status?: string;
  };
};

test.describe.serial('Transfer Notifications Without Email E2E', () => {
  let db: Client;
  let resourceToken = '';

  test.beforeAll(async ({ request }) => {
    db = createDbClientFromEnv();
    await db.connect();

    resourceToken = await loginAs(request, 'resource_camp1', 1);
  });

  test.afterAll(async () => {
    await db.end();
  });

  test('updating transfer status keeps transfer email templates out of outbox', async ({
    request,
  }) => {
    const transferScope = await db.query<{ id: number }>(
      `SELECT t.id
       FROM transfer t
       JOIN intercamp_request r ON r.id = t.request_id
       WHERE r.origin_camp_id = 1 OR r.destination_camp_id = 1
       ORDER BY t.id DESC
       LIMIT 1`,
    );

    test.skip(transferScope.rows.length === 0, 'No hay transfer disponible para validar politica');

    const transferId = transferScope.rows[0].id;

    const beforeCanceledCount = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'transfer_canceled'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(transferId)],
    );

    const updateResponse = await request.put(`/api/transfers/${transferId}`, {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
      data: {
        status: 'CANCELED',
      },
    });

    expect(updateResponse.status()).toBe(200);

    const completedOutbox = await db.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM email_outbox
       WHERE template_key = 'transfer_canceled'
         AND COALESCE(payload->>'sourceId', '') = $1`,
      [String(transferId)],
    );

    expect(Number.parseInt(completedOutbox.rows[0].total, 10)).toBe(
      Number.parseInt(beforeCanceledCount.rows[0].total, 10),
    );
  });
});
