import { expect, test } from '@playwright/test';

type LoginResponse = {
  data?: {
    token?: string;
  };
};

test.describe.serial('Auth API E2E', () => {
  let adminToken = '';
  let visitorToken = '';
  let logoutToken = '';

  test('POST /api/auth/login with valid admin credentials returns 201 and token', async ({
    request,
  }) => {
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
  });

  test('POST /api/auth/login with wrong password returns 401', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'WrongPassword123!',
        campId: 1,
      },
    });

    expect(response.status()).toBe(401);
  });

  test('POST /api/auth/login with missing fields returns 400', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('GET /api/users without Authorization header returns 401', async ({ request }) => {
    const response = await request.get('/api/users');

    expect(response.status()).toBe(401);
  });

  test('GET /api/users with valid SYSTEM_ADMIN token returns 200', async ({ request }) => {
    expect(adminToken.length).toBeGreaterThan(0);

    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.status()).toBe(200);
  });

  test('GET /api/users with valid VISITOR token returns 403', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'visitor_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });

    expect(loginResponse.status()).toBe(201);

    const loginBody = (await loginResponse.json()) as LoginResponse;
    visitorToken = loginBody.data?.token ?? '';
    expect(visitorToken.length).toBeGreaterThan(0);

    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${visitorToken}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('POST /api/auth/logout with valid token returns 201', async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });

    expect(loginResponse.status()).toBe(201);

    const loginBody = (await loginResponse.json()) as LoginResponse;
    logoutToken = loginBody.data?.token ?? '';
    expect(logoutToken.length).toBeGreaterThan(0);

    const response = await request.post('/api/auth/logout', {
      headers: {
        Authorization: `Bearer ${logoutToken}`,
      },
    });

    expect(response.status()).toBe(201);
  });

  test('GET /api/users with logged out token returns 401', async ({ request }) => {
    expect(logoutToken.length).toBeGreaterThan(0);

    const response = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${logoutToken}`,
      },
    });

    expect(response.status()).toBe(401);
  });
});
