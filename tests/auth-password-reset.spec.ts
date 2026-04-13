import { expect, test } from '@playwright/test';

test.describe.serial('Auth Password Reset API E2E', () => {
  test('POST /api/auth/forgot-password returns generic response for existing user', async ({
    request,
  }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'admin@camp1.com',
        campId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      success?: boolean;
      message?: string;
    };

    expect(body.success).toBe(true);
    expect(body.message).toContain('Si el correo pertenece');
  });

  test('POST /api/auth/forgot-password returns same generic response for non-existing user', async ({
    request,
  }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'not-found-user@camp1.com',
        campId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      success?: boolean;
      message?: string;
    };

    expect(body.success).toBe(true);
    expect(body.message).toContain('Si el correo pertenece');
  });

  test('POST /api/auth/reset-password rejects invalid token', async ({ request }) => {
    const response = await request.post('/api/auth/reset-password', {
      data: {
        token: 'invalid-token-for-test-only-1234567890123456',
        newPassword: 'NewStrongPass123!',
      },
    });

    expect(response.status()).toBe(400);
  });
});
