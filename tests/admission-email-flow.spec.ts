import { expect, test } from '@playwright/test';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

type LoginBody = {
  data?: {
    token?: string;
  };
};

type AdmissionBody = {
  data?: {
    id?: number;
    status?: string;
    name?: string;
    lastName1?: string;
    lastName2?: string | null;
    email?: string;
    desiredUsername?: string;
    birthDate?: string;
    gender?: string;
    campId?: number;
    suggestedOccupationId?: number | null;
    finalOccupationId?: number | null;
  };
};

type SystemUser = {
  id: number;
  username: string;
  email: string;
  requestId: number;
  role: string;
  campId: number;
};

function parseEnvFile(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), '.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const values: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

function dbClientFromEnvFile(): Client {
  const env = parseEnvFile();
  const dbSsl = (process.env.DB_SSL ?? env.DB_SSL ?? 'false').toLowerCase() === 'true';

  return new Client({
    host: process.env.DB_HOST ?? env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT ?? env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? env.DB_USER,
    password: process.env.DB_PASSWORD ?? env.DB_PASSWORD,
    database: process.env.DB_NAME ?? env.DB_NAME,
    ssl: dbSsl ? { rejectUnauthorized: false } : false,
  });
}

test.describe.serial('Admission Email Flow E2E', () => {
  const campId = 1;
  let db: Client;
  let adminToken = '';
  let adminUserId = 0;

  test.beforeAll(async ({ request }) => {
    db = dbClientFromEnvFile();
    await db.connect();

    const loginResponse = await request.post('/api/auth/login', {
      data: {
        username: 'admin_camp1',
        password: 'Seed1234!',
        campId,
      },
    });

    expect(loginResponse.status()).toBe(201);
    const loginBody = (await loginResponse.json()) as LoginBody;
    adminToken = loginBody.data?.token ?? '';
    expect(adminToken.length).toBeGreaterThan(10);

    const usersResponse = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(usersResponse.status()).toBe(200);

    const usersBody = (await usersResponse.json()) as {
      data?: SystemUser[];
    };

    const adminUser = (usersBody.data ?? []).find((u) => u.username === 'admin_camp1');
    expect(adminUser).toBeTruthy();
    adminUserId = adminUser?.id ?? 0;
    expect(adminUserId).toBeGreaterThan(0);
  });

  test.afterAll(async () => {
    await db.end();
  });

  test('create -> AI reviewed -> admin approve -> user provisioned + emails queued', async ({
    request,
  }) => {
    const uniqueTag = `${Date.now()}`;
    const applicantEmail = `admision.e2e.${uniqueTag}@example.com`;
    const desiredUsername = `adme2e${uniqueTag.slice(-6)}`;

    const createResponse = await request.post('/api/admission-requests', {
      data: {
        name: 'Correo',
        lastName1: 'Flujo',
        lastName2: 'E2E',
        email: applicantEmail,
        desiredUsername,
        birthDate: '2000-01-31',
        gender: 'MALE',
        declaredHealthLevel: 'ALTO',
        previousExperience: '2 anios en tareas de campo',
        physicalCondition: 'BUENA',
        declaredSkills: 'logistica, vigilancia',
        campId,
      },
    });

    expect(createResponse.status()).toBe(201);

    const createBody = (await createResponse.json()) as AdmissionBody;
    const requestId = createBody.data?.id ?? 0;
    expect(requestId).toBeGreaterThan(0);

    // Wait until request moves to PENDING_ADMIN (AI) or force AI processing fallback.
    let requestStatus = createBody.data?.status ?? 'PENDING_AI';
    let suggestedOccupationId = createBody.data?.suggestedOccupationId ?? null;

    for (let i = 0; i < 8 && requestStatus === 'PENDING_AI'; i += 1) {
      const statusResponse = await request.get(`/api/admission-requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      expect(statusResponse.status()).toBe(200);
      const statusBody = (await statusResponse.json()) as AdmissionBody;
      requestStatus = statusBody.data?.status ?? 'PENDING_AI';
      suggestedOccupationId = statusBody.data?.suggestedOccupationId ?? null;
    }

    if (requestStatus === 'PENDING_AI') {
      const occupationRow = await db.query<{ id: number }>(
        'SELECT id FROM occupation ORDER BY id ASC LIMIT 1',
      );
      expect(occupationRow.rows.length).toBeGreaterThan(0);

      const processResponse = await request.post(`/api/admission-requests/${requestId}/process-ai`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          oficioSugeridoId: occupationRow.rows[0].id,
          decision: 'ACCEPT',
        },
      });

      expect(processResponse.status()).toBe(201);
      const processedBody = (await processResponse.json()) as AdmissionBody;
      requestStatus = processedBody.data?.status ?? requestStatus;
      suggestedOccupationId = processedBody.data?.suggestedOccupationId ?? suggestedOccupationId;
    }

    expect(requestStatus).toBe('PENDING_ADMIN');

    const latestRequestResponse = await request.get(`/api/admission-requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(latestRequestResponse.status()).toBe(200);

    const latestRequestBody = (await latestRequestResponse.json()) as AdmissionBody;
    const reqData = latestRequestBody.data;
    expect(reqData).toBeTruthy();

    const personExists = await db.query<{ id: number }>(
      'SELECT id FROM person WHERE admission_request_id = $1',
      [requestId],
    );

    if (personExists.rows.length === 0) {
      const occupationIdForPerson =
        reqData?.finalOccupationId ?? reqData?.suggestedOccupationId ?? suggestedOccupationId ?? 1;

      await db.query(
        `INSERT INTO person (
          admission_request_id,
          name,
          last_name1,
          last_name2,
          identification_number,
          birth_date,
          gender,
          initial_health_level,
          previous_experience,
          physical_condition_at_entry,
          current_status,
          camp_id,
          occupation_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'ACTIVE',$11,$12)`,
        [
          requestId,
          reqData?.name ?? 'Correo',
          reqData?.lastName1 ?? 'Flujo',
          reqData?.lastName2 ?? null,
          `ID-E2E-${requestId}-${Date.now()}`,
          reqData?.birthDate?.slice(0, 10) ?? '2000-01-31',
          reqData?.gender ?? 'MALE',
          'ALTO',
          reqData?.previousExperience ?? 'sin experiencia',
          reqData?.physicalCondition ?? 'ESTABLE',
          campId,
          occupationIdForPerson,
        ],
      );
    }

    const reviewResponse = await request.post(`/api/admission-requests/${requestId}/review`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        adminUserId,
        approved: true,
      },
    });

    expect(reviewResponse.status()).toBe(201);
    const reviewBody = (await reviewResponse.json()) as AdmissionBody;
    expect(reviewBody.data?.status).toBe('APPROVED');

    const usersResponse = await request.get('/api/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(usersResponse.status()).toBe(200);
    const usersBody = (await usersResponse.json()) as { data?: SystemUser[] };
    const createdUser = (usersBody.data ?? []).find((u) => u.requestId === requestId);
    expect(createdUser).toBeTruthy();
    expect(createdUser?.campId).toBe(campId);

    const applicantOutboxRows = await db.query<{
      template_key: string;
      payload: Record<string, unknown>;
    }>(
      `SELECT template_key, payload
       FROM email_outbox
       WHERE to_email = $1
       ORDER BY id ASC`,
      [applicantEmail],
    );

    const applicantTemplates = applicantOutboxRows.rows.map((r) => r.template_key);
    expect(applicantTemplates).toContain('admission_request_pending');
    expect(applicantTemplates).toContain('admission_request_ai_reviewed');
    expect(applicantTemplates).toContain('admission_request_approved');

    const approvedMail = applicantOutboxRows.rows.find(
      (row) => row.template_key === 'admission_request_approved',
    );
    expect(approvedMail).toBeTruthy();

    const approvedPayload = approvedMail?.payload as {
      details?: {
        contrasenaTemporal?: string;
        rolSistema?: string;
        usuarioAsignado?: string;
        oficioAsignado?: string;
      };
    };

    const tempPassword = approvedPayload?.details?.contrasenaTemporal;
    expect(tempPassword).toBeTruthy();
    expect(tempPassword).not.toBe('NO_GENERADA');
    expect(approvedPayload?.details?.rolSistema).toBeTruthy();
    expect(approvedPayload?.details?.usuarioAsignado).toBeTruthy();
    expect(approvedPayload?.details?.oficioAsignado).toBeTruthy();

    const activeAdminEmails = (usersBody.data ?? [])
      .filter((u) => u.role === 'SYSTEM_ADMIN' && typeof u.email === 'string' && u.email.trim() !== '')
      .map((u) => u.email.trim().toLowerCase());

    if (activeAdminEmails.length > 0) {
      const adminAiEmails = await db.query<{ total: string }>(
        `SELECT COUNT(*)::text AS total
         FROM email_outbox e
         WHERE e.template_key = 'admission_request_ai_reviewed'
           AND LOWER(e.to_email) = ANY($1::text[])
           AND e.created_at >= NOW() - INTERVAL '30 minutes'`,
        [activeAdminEmails],
      );

      expect(Number.parseInt(adminAiEmails.rows[0].total, 10)).toBeGreaterThan(0);
    }
  });
});
