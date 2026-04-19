import { expect, test } from '@playwright/test';

import { createDbClientFromEnv, loginAs } from './helpers/e2e-support';

type ExpeditionCreateBody = {
  data?: {
    id?: number;
  };
};

test.describe('Requirement 4 - Expeditions full flow', () => {
  const db = createDbClientFromEnv();

  let travelToken = '';

  test.beforeAll(async () => {
    await db.connect();
  });

  test.afterAll(async () => {
    await db.end();
  });

  test.beforeEach(async ({ request }) => {
    travelToken = await loginAs(request, 'travel_camp1', 1);
  });

  test('validates participant occupation and applies additional rations on departure', async ({ request }) => {
    const eligiblePerson = await db.query<{ id: number }>(
      `
      SELECT p.id
      FROM person p
      INNER JOIN occupation o ON o.id = p.occupation_id
      WHERE p.camp_id = 1
        AND p.current_status = 'ACTIVE'
        AND o.participates_in_expeditions = true
      ORDER BY p.id ASC
      LIMIT 1
      `,
    );

    const ineligiblePerson = await db.query<{ id: number }>(
      `
      SELECT p.id
      FROM person p
      INNER JOIN occupation o ON o.id = p.occupation_id
      WHERE p.camp_id = 1
        AND p.current_status = 'ACTIVE'
        AND o.participates_in_expeditions = false
      ORDER BY p.id ASC
      LIMIT 1
      `,
    );

    test.skip(
      eligiblePerson.rowCount === 0 || ineligiblePerson.rowCount === 0,
      'Seed data does not contain both eligible and ineligible occupation profiles',
    );

    const foodAndWater = await db.query<{ id: number; category: 'FOOD' | 'WATER' }>(
      `
      SELECT id, category
      FROM resource_type
      WHERE category IN ('FOOD', 'WATER')
      `,
    );

    const foodId = foodAndWater.rows.find((row) => row.category === 'FOOD')?.id;
    const waterId = foodAndWater.rows.find((row) => row.category === 'WATER')?.id;

    test.skip(foodId === undefined || waterId === undefined, 'FOOD/WATER resources are required');

    const now = new Date();
    const departureDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const createResponse = await request.post('/api/expeditions', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
      data: {
        campId: 1,
        name: `req4-expedition-${Date.now()}`,
        objective: 'Cobertura completa del requerimiento 4',
        destinationDescription: 'Sector de abastecimiento remoto',
        plannedDepartureDate: departureDate.toISOString(),
        estimatedDurationDays: 2,
        maxExtraDays: 1,
      },
    });

    expect(createResponse.status()).toBe(201);

    const createBody = (await createResponse.json()) as ExpeditionCreateBody;
    const expeditionId = createBody.data?.id ?? 0;
    expect(expeditionId).toBeGreaterThan(0);

    const ineligibleParticipantResponse = await request.post('/api/expedition-participants', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
      data: {
        expeditionId,
        personId: ineligiblePerson.rows[0].id,
      },
    });

    expect(ineligibleParticipantResponse.status()).toBe(400);

    const eligibleParticipantResponse = await request.post('/api/expedition-participants', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
      data: {
        expeditionId,
        personId: eligiblePerson.rows[0].id,
      },
    });

    expect(eligibleParticipantResponse.status()).toBe(201);

    const inventoryBefore = await db.query<{ resource_type_id: number; current_amount: string }>(
      `
      SELECT resource_type_id, current_amount
      FROM camp_inventory
      WHERE camp_id = 1
        AND resource_type_id IN ($1, $2)
      `,
      [foodId, waterId],
    );

    const inventoryBeforeMap = new Map(
      inventoryBefore.rows.map((row) => [row.resource_type_id, Number.parseFloat(row.current_amount)]),
    );

    const startResponse = await request.put(`/api/expeditions/${expeditionId}`, {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    expect(startResponse.status()).toBe(200);

    const departureMovements = await db.query<{ total: string }>(
      `
      SELECT COUNT(*)::text AS total
      FROM inventory_movement
      WHERE movement_type = 'EXPEDITION_DEPARTURE'
        AND source_type = 'expedition_departure_auto'
        AND source_id = $1
      `,
      [expeditionId],
    );

    expect(Number.parseInt(departureMovements.rows[0].total, 10)).toBe(2);

    const inventoryAfter = await db.query<{ resource_type_id: number; current_amount: string }>(
      `
      SELECT resource_type_id, current_amount
      FROM camp_inventory
      WHERE camp_id = 1
        AND resource_type_id IN ($1, $2)
      `,
      [foodId, waterId],
    );

    const inventoryAfterMap = new Map(
      inventoryAfter.rows.map((row) => [row.resource_type_id, Number.parseFloat(row.current_amount)]),
    );

    const beforeFood = inventoryBeforeMap.get(foodId) ?? 0;
    const beforeWater = inventoryBeforeMap.get(waterId) ?? 0;
    const afterFood = inventoryAfterMap.get(foodId) ?? 0;
    const afterWater = inventoryAfterMap.get(waterId) ?? 0;

    expect(afterFood).toBeLessThan(beforeFood);
    expect(afterWater).toBeLessThan(beforeWater);
  });
});
