import { expect, test } from '@playwright/test';

type LoginResponse = {
  data?: {
    token?: string;
  };
};

test.describe.serial('Users API E2E', () => {
  let adminToken = '';
  let workerToken = '';
  let resourceToken = '';
  let travelToken = '';
  let visitorToken = '';

  test.beforeAll(async ({ request }) => {
    const login = async (username: string): Promise<string> => {
      const response = await request.post('/api/auth/login', {
        data: {
          username,
          password: 'Seed1234!',
          campId: 1,
        },
      });

      expect(response.status()).toBe(201);

      const body = (await response.json()) as LoginResponse;
      expect(body.data?.token).toBeTruthy();

      await new Promise((resolve) => setTimeout(resolve, 500));

      return body.data?.token ?? '';
    };

    adminToken = await login('admin_camp1');
    workerToken = await login('worker_camp1');
    resourceToken = await login('resource_camp1');
    travelToken = await login('travel_camp1');
    visitorToken = await login('visitor_camp1');

    expect(adminToken.length).toBeGreaterThan(0);
    expect(workerToken.length).toBeGreaterThan(0);
    expect(resourceToken.length).toBeGreaterThan(0);
    expect(travelToken.length).toBeGreaterThan(0);
    expect(visitorToken.length).toBeGreaterThan(0);
  });

  test('GET /api/users with SYSTEM_ADMIN returns 200', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.status()).toBe(200);
  });

  test('GET /api/users with WORKER returns 403', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${workerToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users with RESOURCE_MANAGEMENT returns 403', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users with TRAVEL_MANAGER returns 403', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users with VISITOR returns 403', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${visitorToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users/1 with SYSTEM_ADMIN returns 200', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.status()).toBe(200);
  });

  test('GET /api/users/1 with WORKER returns 403', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: {
        Authorization: `Bearer ${workerToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users/1 with RESOURCE_MANAGEMENT returns 403', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: {
        Authorization: `Bearer ${resourceToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users/1 with TRAVEL_MANAGER returns 403', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: {
        Authorization: `Bearer ${travelToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('GET /api/users/1 with VISITOR returns 403', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: {
        Authorization: `Bearer ${visitorToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });
});
