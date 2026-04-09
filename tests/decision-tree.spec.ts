import { expect, test } from '@playwright/test';

type LoginResponse = {
  data?: {
    token?: string;
  };
};

test.describe.serial('Decision Tree AI E2E', () => {
  let adminToken = '';
  let admissionModelId = 0;

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId: 1,
      },
    });

    expect(loginResponse.status()).toBe(201);

    const loginBody = (await loginResponse.json()) as LoginResponse;
    adminToken = loginBody.data?.token ?? '';
    expect(adminToken.length).toBeGreaterThan(0);

    const modelsResponse = await request.get(
      '/api/decision-tree/models?modelName=admission-acceptance-v1&isActive=true&page=1&limit=1',
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    expect(modelsResponse.status()).toBe(200);

    const modelsBody = (await modelsResponse.json()) as {
      data?: Array<{ id?: number }>;
    };

    admissionModelId = modelsBody.data?.[0]?.id ?? 0;
    expect(admissionModelId).toBeGreaterThan(0);
  });

  test('POST /api/decision-tree/predict returns trained role assignment', async ({ request }) => {
    const response = await request.post('/api/decision-tree/predict', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        modelId: admissionModelId,
        features: {
          age_years: 29,
          health_level_score: 8,
          physical_condition_score: 9,
          experience_years: 4,
          skills_score: 8,
        },
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      success?: boolean;
      data?: {
        prediction?: string;
        roleAssignment?: {
          suggestedRole?: string;
          mappedOccupationName?: string;
          modelName?: string;
          rules?: string[];
          summary?: string;
          reason?: string;
          recommendedAttributes?: string[];
        };
        explanation?: {
          admissionSummary?: string;
          roleSummary?: string;
          admissionReason?: string;
          roleReason?: string;
        };
      };
    };

    expect(body.success).toBe(true);
    expect(body.data?.prediction).toMatch(/^(ACCEPT|REJECT)$/);
    expect(body.data?.roleAssignment?.suggestedRole).toBeTruthy();
    expect(body.data?.roleAssignment?.mappedOccupationName).toBeTruthy();
    expect(body.data?.roleAssignment?.modelName).toBe('admission-role-assignment-v1');
    expect(Array.isArray(body.data?.roleAssignment?.rules)).toBe(true);
    expect(body.data?.roleAssignment?.rules?.length ?? 0).toBeGreaterThan(0);
    expect(body.data?.roleAssignment?.summary).toContain('Cargo sugerido');
    expect(body.data?.roleAssignment?.reason).toBeTruthy();
    expect(Array.isArray(body.data?.roleAssignment?.recommendedAttributes)).toBe(true);
    expect(body.data?.roleAssignment?.recommendedAttributes?.length ?? 0).toBeGreaterThan(0);
    expect(body.data?.explanation?.admissionSummary).toContain('modelo');
    expect(body.data?.explanation?.admissionReason).toContain('Aceptado');
    expect(body.data?.explanation?.roleSummary).toContain('Cargo sugerido');
    expect(body.data?.explanation?.roleReason).toBeTruthy();
  });

  test('POST /api/decision-tree/explain returns role rules too', async ({ request }) => {
    const response = await request.post('/api/decision-tree/explain', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        modelId: admissionModelId,
        features: {
          age_years: 41,
          health_level_score: 7,
          physical_condition_score: 6,
          experience_years: 9,
          skills_score: 8,
        },
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      data?: {
        prediction?: string;
        rules?: string[];
        roleAssignment?: {
          suggestedRole?: string;
          modelName?: string;
          rules?: string[];
          summary?: string;
          reason?: string;
          recommendedAttributes?: string[];
        };
        explanation?: {
          admissionSummary?: string;
          roleSummary?: string;
          admissionReason?: string;
          roleReason?: string;
        };
      };
    };

    expect(body.data?.prediction).toMatch(/^(ACCEPT|REJECT)$/);
    expect(Array.isArray(body.data?.rules)).toBe(true);
    expect(body.data?.roleAssignment?.suggestedRole).toBeTruthy();
    expect(body.data?.roleAssignment?.modelName).toBe('admission-role-assignment-v1');
    expect(Array.isArray(body.data?.roleAssignment?.rules)).toBe(true);
    expect(body.data?.roleAssignment?.rules?.length ?? 0).toBeGreaterThan(0);
    expect(body.data?.roleAssignment?.summary).toContain('Cargo sugerido');
    expect(body.data?.roleAssignment?.reason).toBeTruthy();
    expect(Array.isArray(body.data?.roleAssignment?.recommendedAttributes)).toBe(true);
    expect(body.data?.roleAssignment?.recommendedAttributes?.length ?? 0).toBeGreaterThan(0);
    expect(body.data?.explanation?.admissionSummary).toContain('modelo');
    expect(body.data?.explanation?.admissionReason).toContain('Aceptado');
    expect(body.data?.explanation?.roleSummary).toContain('Cargo sugerido');
    expect(body.data?.explanation?.roleReason).toBeTruthy();
  });
});
