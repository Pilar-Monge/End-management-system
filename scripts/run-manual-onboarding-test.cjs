const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function parseEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const values = {};

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

function createDbClientFromEnv() {
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

async function api(baseUrl, method, endpoint, token, body) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  return { status: response.status, body: json };
}

async function ensurePersonForAdmission(db, requestId, campId, requestData, occupationId) {
  const found = await db.query('SELECT id FROM person WHERE admission_request_id = $1 LIMIT 1', [requestId]);
  if (found.rows.length > 0) {
    return found.rows[0].id;
  }

  const insert = await db.query(
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
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'ACTIVE',$11,$12)
    RETURNING id`,
    [
      requestId,
      requestData.name,
      requestData.lastName1,
      requestData.lastName2,
      `CR-ADM-${Date.now()}`,
      requestData.birthDate.slice(0, 10),
      requestData.gender,
      requestData.declaredHealthLevel,
      requestData.previousExperience,
      requestData.physicalCondition,
      campId,
      occupationId,
    ],
  );

  return insert.rows[0].id;
}

async function main() {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
  const campId = 1;
  const expectedRole = 'RESOURCE_MANAGEMENT';
  const skipReview = (process.env.SKIP_REVIEW || 'false').toLowerCase() === 'true';
  const nowTag = `${Date.now()}`;

  const admissionPayload = {
    name: process.env.ADMISSION_NAME || 'Edicson',
    lastName1: process.env.ADMISSION_LASTNAME1 || 'Picado',
    lastName2: process.env.ADMISSION_LASTNAME2 || 'Quesada',
    email: process.env.ADMISSION_EMAIL || 'edicsonpicadoquesada@gmail.com',
    desiredUsername: process.env.ADMISSION_USERNAME || `adicandidato${nowTag.slice(-6)}`,
    birthDate: process.env.ADMISSION_BIRTHDATE || '1998-08-15',
    gender: process.env.ADMISSION_GENDER || 'MALE',
    declaredHealthLevel: process.env.ADMISSION_HEALTH || 'ALTO',
    previousExperience:
      process.env.ADMISSION_EXPERIENCE ||
      'Experiencia formal en gestion logistica, control de insumos y coordinacion de inventarios.',
    physicalCondition: process.env.ADMISSION_PHYSICAL || 'BUENA',
    declaredSkills:
      process.env.ADMISSION_SKILLS ||
      'planificacion de recursos, control documental, liderazgo operativo, trabajo bajo protocolos',
    campId,
  };

  const db = createDbClientFromEnv();
  await db.connect();

  try {
    const loginRes = await api(baseUrl, 'POST', '/api/auth/login', null, {
      username: 'admin_camp1',
      password: 'Seed1234!',
      campId,
    });

    if (loginRes.status !== 201) {
      throw new Error(`No se pudo iniciar sesion admin. status=${loginRes.status}`);
    }

    const token = loginRes.body?.data?.token;
    if (!token) {
      throw new Error('Token admin no recibido');
    }

    const usersRes = await api(baseUrl, 'GET', '/api/users', token);
    if (usersRes.status !== 200) {
      throw new Error(`No se pudo listar usuarios. status=${usersRes.status}`);
    }

    const adminUser = (usersRes.body?.data || []).find((u) => u.username === 'admin_camp1');
    if (!adminUser) {
      throw new Error('No se encontro admin_camp1 para review');
    }

    const occQuery = await db.query(
      `SELECT id, name, collects_resources, participates_in_expeditions
       FROM occupation
       WHERE collects_resources = true
         AND participates_in_expeditions = false
       ORDER BY id ASC
       LIMIT 1`,
    );

    if (occQuery.rows.length === 0) {
      throw new Error('No existe un oficio que mapee a RESOURCE_MANAGEMENT');
    }

    const suggestedOccupation = occQuery.rows[0];

    const createRes = await api(baseUrl, 'POST', '/api/admission-requests', null, admissionPayload);

    let requestId = createRes.body?.data?.id;
    let status = createRes.body?.data?.status || 'PENDING_AI';
    let reusedExistingRequest = false;

    if (createRes.status !== 201) {
      const existingReq = await db.query(
        `SELECT id, status
         FROM admission_request
         WHERE LOWER(email) = LOWER($1)
         ORDER BY id DESC
         LIMIT 1`,
        [admissionPayload.email],
      );

      if (createRes.status === 400 && existingReq.rows.length > 0) {
        const latestExisting = existingReq.rows[0];

        if (['PENDING_AI', 'PENDING_ADMIN'].includes(latestExisting.status)) {
          requestId = latestExisting.id;
          status = latestExisting.status;
          reusedExistingRequest = true;
        } else {
          const archivedEmail = `archived+${nowTag}+${admissionPayload.email}`;

          await db.query(
            `UPDATE admission_request
             SET email = $2,
                 updated_at = NOW()
             WHERE id = $1`,
            [latestExisting.id, archivedEmail],
          );

          const retryCreateRes = await api(
            baseUrl,
            'POST',
            '/api/admission-requests',
            null,
            admissionPayload,
          );

          if (retryCreateRes.status !== 201) {
            throw new Error(
              `Fallo creando solicitud tras archivar correo previo. status=${retryCreateRes.status}. body=${JSON.stringify(retryCreateRes.body)}`,
            );
          }

          requestId = retryCreateRes.body?.data?.id;
          status = retryCreateRes.body?.data?.status || 'PENDING_AI';
          reusedExistingRequest = false;
          console.log(
            `Se archivo el correo de la solicitud previa #${latestExisting.id} para permitir la nueva prueba con el mismo correo.`,
          );
        }
      } else {
        throw new Error(
          `Fallo creando solicitud. status=${createRes.status}. body=${JSON.stringify(createRes.body)}`,
        );
      }
    }

    if (!requestId) {
      throw new Error('No se obtuvo requestId');
    }

    for (let i = 0; i < 8 && status === 'PENDING_AI'; i += 1) {
      const getRes = await api(baseUrl, 'GET', `/api/admission-requests/${requestId}`, token);
      if (getRes.status !== 200) {
        throw new Error(`Fallo consultando solicitud ${requestId}. status=${getRes.status}`);
      }
      status = getRes.body?.data?.status || status;
    }

    if (status === 'PENDING_AI') {
      const aiRes = await api(baseUrl, 'POST', `/api/admission-requests/${requestId}/process-ai`, token, {
        oficioSugeridoId: suggestedOccupation.id,
        decision: 'ACCEPT',
      });

      if (aiRes.status !== 201) {
        throw new Error(`Fallo process-ai. status=${aiRes.status}`);
      }

      status = aiRes.body?.data?.status || status;
    }

    if (status !== 'PENDING_ADMIN') {
      throw new Error(`Estado inesperado antes de review: ${status}`);
    }

    await db.query(
      `UPDATE admission_request
       SET suggested_occupation_id = $2,
           final_occupation_id = $2,
           occupation_modified = true,
           updated_at = NOW()
       WHERE id = $1`,
      [requestId, suggestedOccupation.id],
    );

    const detailRes = await api(baseUrl, 'GET', `/api/admission-requests/${requestId}`, token);
    if (detailRes.status !== 200) {
      throw new Error(`No se pudo leer solicitud final previa a review. status=${detailRes.status}`);
    }

    let approvedStatus = status;
    let createdUser = null;

    if (!skipReview) {
      await ensurePersonForAdmission(
        db,
        requestId,
        campId,
        {
          ...admissionPayload,
          ...detailRes.body?.data,
        },
        suggestedOccupation.id,
      );

      const reviewRes = await api(baseUrl, 'POST', `/api/admission-requests/${requestId}/review`, token, {
        adminUserId: adminUser.id,
        approved: true,
      });

      if (reviewRes.status !== 201) {
        throw new Error(
          `Fallo review admin. status=${reviewRes.status}. body=${JSON.stringify(reviewRes.body)}`,
        );
      }

      approvedStatus = reviewRes.body?.data?.status;
      if (approvedStatus !== 'APPROVED') {
        throw new Error(`La solicitud no quedo APPROVED. status=${approvedStatus}`);
      }

      const usersAfterRes = await api(baseUrl, 'GET', '/api/users', token);
      if (usersAfterRes.status !== 200) {
        throw new Error(`No se pudo listar usuarios post-aprobacion. status=${usersAfterRes.status}`);
      }

      createdUser = (usersAfterRes.body?.data || []).find((u) => u.requestId === requestId);
      if (!createdUser) {
        throw new Error('No se creo usuario del sistema para la solicitud');
      }
    }

    const outboxRes = await db.query(
      `SELECT template_key, payload, created_at
       FROM email_outbox
       WHERE to_email = $1
         AND created_at >= NOW() - INTERVAL '2 hours'
       ORDER BY id ASC`,
      [admissionPayload.email.toLowerCase()],
    );

    const templates = outboxRes.rows.map((r) => r.template_key);

    const recentPayloads = outboxRes.rows
      .map((row) => row.payload)
      .filter((payload) => payload && typeof payload === 'object');

    const hasSolicitudIdInPayload = recentPayloads.some((payload) => {
      const details = payload.details && typeof payload.details === 'object' ? payload.details : null;
      return Boolean(details && Object.prototype.hasOwnProperty.call(details, 'solicitudId'));
    });

    const hasAiMentionInPayload = recentPayloads.some((payload) => {
      const payloadText = JSON.stringify(payload).toLowerCase();
      return payloadText.includes(' ia ') || payloadText.includes('evaluada por ia');
    });

    console.log('=== RESULTADO PRUEBA DE INGRESO COMPLETO ===');
    console.log(`Solicitud ID: ${requestId}`);
    console.log(`Solicitud reutilizada por duplicado: ${reusedExistingRequest ? 'SI' : 'NO'}`);
    console.log(`Nombre: ${admissionPayload.name} ${admissionPayload.lastName1} ${admissionPayload.lastName2}`);
    console.log(`Correo: ${admissionPayload.email}`);
    console.log(`Oficio sugerido usado: ${suggestedOccupation.name} (id=${suggestedOccupation.id})`);
    console.log(`Review administrativa ejecutada: ${skipReview ? 'NO' : 'SI'}`);
    if (!skipReview) {
      console.log(`Rol esperado: ${expectedRole}`);
      console.log(`Rol asignado: ${createdUser.role}`);
      console.log(`Usuario creado: ${createdUser.username}`);
    }
    console.log(`Estado solicitud final: ${approvedStatus}`);
    console.log(`Plantillas en outbox para solicitante: ${templates.join(', ') || 'NINGUNA'}`);
    console.log(`Payload incluye solicitudId para solicitante: ${hasSolicitudIdInPayload ? 'SI' : 'NO'}`);
    console.log(`Payload menciona IA para solicitante: ${hasAiMentionInPayload ? 'SI' : 'NO'}`);
    if (!skipReview) {
      console.log(`Match rol esperado: ${createdUser.role === expectedRole ? 'SI' : 'NO'}`);
    }

    if (
      (skipReview ? false : createdUser.role !== expectedRole) ||
      hasSolicitudIdInPayload ||
      hasAiMentionInPayload
    ) {
      process.exitCode = 2;
    }
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error('ERROR EN PRUEBA MANUAL:', error.message);
  process.exit(1);
});
