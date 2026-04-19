import { APIRequestContext, expect } from '@playwright/test';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export type LoginBody = {
  data?: {
    token?: string;
  };
};

export type ApiListBody<T> = {
  data?: T[];
};

export type SystemUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
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

export function createDbClientFromEnv(): Client {
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

export async function loginAs(
  request: APIRequestContext,
  username: string,
  campId: number,
): Promise<string> {
  const response = await request.post('/api/auth/login', {
    data: {
      username,
      password: 'Seed1234!',
      campId,
    },
  });

  expect(response.status()).toBe(201);
  const body = (await response.json()) as LoginBody;
  const token = body.data?.token ?? '';
  expect(token.length).toBeGreaterThan(10);
  return token;
}

export async function getUsersByAdminToken(
  request: APIRequestContext,
  adminToken: string,
): Promise<SystemUser[]> {
  const usersResponse = await request.get('/api/users', {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  expect(usersResponse.status()).toBe(200);
  const usersBody = (await usersResponse.json()) as ApiListBody<SystemUser>;
  return usersBody.data ?? [];
}
