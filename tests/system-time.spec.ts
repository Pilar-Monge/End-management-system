import { expect, test } from '@playwright/test';

type LoginResponse = {
  data?: {
    token?: string;
  };
};

type SystemTimeResponse = {
  serverTime?: string;
};

type AdvanceTimeResponse = {
  success?: boolean;
  data?: {
    offsetMilliseconds?: number;
    currentSystemTime?: string;
    automations?: string[];
  };
  message?: string;
};

type OffsetResponse = {
  success?: boolean;
  data?: {
    offsetMilliseconds?: number;
    currentSystemTime?: string;
  };
};

test.describe.serial('System Time API E2E', () => {
  let adminToken = '';
  let initialTime: Date;

  test('GET /api/system/time returns current time (Public)', async ({ request }) => {
    const response = await request.get('/api/system/time');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as SystemTimeResponse;
    expect(body.serverTime).toBeTruthy();

    initialTime = new Date(body.serverTime || new Date());
    console.log('Initial system time:', body.serverTime);
  });

  test('Login as admin', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });

    expect(response.status()).toBe(201);
    const body = (await response.json()) as LoginResponse;
    expect(body.data?.token).toBeTruthy();

    adminToken = body.data?.token ?? '';
    expect(adminToken.length).toBeGreaterThan(0);
    console.log('Admin token obtained');
  });

  test('GET /api/system/time/offset returns offset (Admin only)', async ({
    request,
  }) => {
    const response = await request.get('/api/system/time/offset', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as OffsetResponse;
    expect(body.data?.offsetMilliseconds).toBeDefined();
    expect(typeof body.data?.offsetMilliseconds).toBe('number');
    console.log('Current offset:', body.data?.offsetMilliseconds, 'ms');
  });

  test('GET /api/system/time/offset without auth returns 401', async ({ request }) => {
    const response = await request.get('/api/system/time/offset');
    expect(response.status()).toBe(401);
  });

  test('POST /api/system/time/advance advances time by 1 hour (Admin only)', async ({
    request,
  }) => {
    const response = await request.post('/api/system/time/advance', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        unit: 'hours',
        amount: 1,
      },
    });

    expect(response.status()).toBe(201);
    const body = (await response.json()) as AdvanceTimeResponse;
    expect(body.success).toBe(true);
    expect(body.data?.offsetMilliseconds).toBeGreaterThan(0);
    expect(body.data?.currentSystemTime).toBeTruthy();
    expect(body.data?.automations).toBeDefined();
    console.log(
      'Advanced 1 hour. Offset:',
      body.data?.offsetMilliseconds,
      'ms. Automations executed:',
      body.data?.automations?.length,
    );
    console.log('Automations:', body.data?.automations);
  });

  test('POST /api/system/time/advance advances time by 30 minutes (Admin only)', async ({
    request,
  }) => {
    // Re-login to get fresh token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });
    const freshToken = ((await loginResponse.json()) as LoginResponse).data?.token ?? '';

    const response = await request.post('/api/system/time/advance', {
      headers: {
        Authorization: `Bearer ${freshToken}`,
      },
      data: {
        unit: 'minutes',
        amount: 30,
      },
    });

    expect(response.status()).toBe(201);
    const body = (await response.json()) as AdvanceTimeResponse;
    expect(body.success).toBe(true);
    expect(body.data?.offsetMilliseconds).toBeGreaterThan(3600000); // More than 1 hour from first advance
    console.log(
      'Advanced 30 minutes. Total offset:',
      body.data?.offsetMilliseconds,
      'ms',
    );
  });

  test('POST /api/system/time/advance with invalid unit returns 400', async ({
    request,
  }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });
    const freshToken = ((await loginResponse.json()) as LoginResponse).data?.token ?? '';

    const response = await request.post('/api/system/time/advance', {
      headers: {
        Authorization: `Bearer ${freshToken}`,
      },
      data: {
        unit: 'invalid_unit',
        amount: 1,
      },
    });

    expect(response.status()).toBe(400);
    console.log('Invalid unit correctly rejected');
  });

  test('POST /api/system/time/advance with negative amount returns 400', async ({
    request,
  }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });
    const freshToken = ((await loginResponse.json()) as LoginResponse).data?.token ?? '';

    const response = await request.post('/api/system/time/advance', {
      headers: {
        Authorization: `Bearer ${freshToken}`,
      },
      data: {
        unit: 'hours',
        amount: -1,
      },
    });

    expect(response.status()).toBe(400);
    console.log('Negative amount correctly rejected');
  });

  test('POST /api/system/time/advance without auth returns 401', async ({ request }) => {
    const response = await request.post('/api/system/time/advance', {
      data: {
        unit: 'hours',
        amount: 1,
      },
    });

    expect(response.status()).toBe(401);
  });

  test('Verify time has advanced by checking GET /api/system/time', async ({
    request,
  }) => {
    const response = await request.get('/api/system/time');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as SystemTimeResponse;
    const newTime = new Date(body.serverTime || new Date());

    const timeDifference = newTime.getTime() - initialTime.getTime();
    // Should be approximately 90 minutes (3600000 + 1800000)
    expect(timeDifference).toBeGreaterThan(5000000); // At least 1.5 hours
    console.log(
      'Time difference from initial:',
      Math.round(timeDifference / 60000),
      'minutes',
    );
  });

  test('POST /api/system/time/advance by 1 day triggers daily automations', async ({
    request,
  }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });
    const freshToken = ((await loginResponse.json()) as LoginResponse).data?.token ?? '';

    const response = await request.post('/api/system/time/advance', {
      headers: {
        Authorization: `Bearer ${freshToken}`,
      },
      data: {
        unit: 'hours',
        amount: 24,
      },
    });

    expect(response.status()).toBe(201);
    const body = (await response.json()) as AdvanceTimeResponse;
    expect(body.success).toBe(true);
    expect(body.data?.automations?.length ?? 0).toBeGreaterThan(0);
    console.log('Daily automation (1 day advance) - Automations:', body.data?.automations);
  });
});
