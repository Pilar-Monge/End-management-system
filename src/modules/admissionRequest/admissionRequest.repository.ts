import { Pool } from 'pg';
import {
  AdmissionRequest,
  CreateAdmissionRequestDTO,
  UpdateAdmissionRequestDTO,
  AdmissionRequestStatus,
  Gender
} from './admissionRequest.model';

export class AdmissionRequestRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(data: CreateAdmissionRequestDTO): Promise<AdmissionRequest> {
    const query = `
      INSERT INTO solicitud_ingreso (
        nombre_completo, correo, username_deseado, fecha_nacimiento, 
        genero, foto_url, nivel_salud_declarado, experiencias_previas, 
        condicion_fisica, habilidades_declaradas, campamento_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING 
        id, nombre_completo as "nombreCompleto", correo, 
        username_deseado as "usernameDeseado", fecha_nacimiento as "fechaNacimiento", 
        genero, foto_url as "fotoUrl", nivel_salud_declarado as "nivelSaludDeclarado", 
        experiencias_previas as "experienciasPrevias", condicion_fisica as "condicionFisica", 
        habilidades_declaradas as "habilidadesDeclaradas", campamento_id as "campamentoId", 
        estado, oficio_sugerido_id as "oficioSugeridoId", revisado_por as "revisadoPor", 
        fecha_revision as "fechaRevision", motivo_rechazo as "motivoRechazo", 
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const values = [
      data.nombreCompleto,
      data.correo,
      data.usernameDeseado,
      data.fechaNacimiento,
      data.genero,
      data.fotoUrl || null,
      data.nivelSaludDeclarado || null,
      data.experienciasPrevias || null,
      data.condicionFisica || null,
      data.habilidadesDeclaradas || null,
      data.campamentoId
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<AdmissionRequest | null> {
    const query = `
      SELECT 
        id, nombre_completo as "nombreCompleto", correo, 
        username_deseado as "usernameDeseado", fecha_nacimiento as "fechaNacimiento", 
        genero, foto_url as "fotoUrl", nivel_salud_declarado as "nivelSaludDeclarado", 
        experiencias_previas as "experienciasPrevias", condicion_fisica as "condicionFisica", 
        habilidades_declaradas as "habilidadesDeclaradas", campamento_id as "campamentoId", 
        estado, oficio_sugerido_id as "oficioSugeridoId", revisado_por as "revisadoPor", 
        fecha_revision as "fechaRevision", motivo_rechazo as "motivoRechazo", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM solicitud_ingreso
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(filters?: {
    campamentoId?: string;
    estado?: AdmissionRequestStatus;
    offset?: number;
    limit?: number;
  }): Promise<AdmissionRequest[]> {
    let query = `
      SELECT 
        id, nombre_completo as "nombreCompleto", correo, 
        username_deseado as "usernameDeseado", fecha_nacimiento as "fechaNacimiento", 
        genero, foto_url as "fotoUrl", nivel_salud_declarado as "nivelSaludDeclarado", 
        experiencias_previas as "experienciasPrevias", condicion_fisica as "condicionFisica", 
        habilidades_declaradas as "habilidadesDeclaradas", campamento_id as "campamentoId", 
        estado, oficio_sugerido_id as "oficioSugeridoId", revisado_por as "revisadoPor", 
        fecha_revision as "fechaRevision", motivo_rechazo as "motivoRechazo", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM solicitud_ingreso
      WHERE 1=1
    `;

    const values: any[] = [];
    let paramCount = 1;

    if (filters?.campamentoId) {
      query += ` AND campamento_id = $${paramCount}`;
      values.push(filters.campamentoId);
      paramCount++;
    }

    if (filters?.estado) {
      query += ` AND estado = $${paramCount}`;
      values.push(filters.estado);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async update(id: string, data: UpdateAdmissionRequestDTO): Promise<AdmissionRequest | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fieldMappings: Record<string, string> = {
      nombreCompleto: 'nombre_completo',
      usernameDeseado: 'username_deseado',
      fechaNacimiento: 'fecha_nacimiento',
      fotoUrl: 'foto_url',
      nivelSaludDeclarado: 'nivel_salud_declarado',
      experienciasPrevias: 'experiencias_previas',
      condicionFisica: 'condicion_fisica',
      habilidadesDeclaradas: 'habilidades_declaradas',
      oficioSugeridoId: 'oficio_sugerido_id',
      revisadoPor: 'revisado_por',
      fechaRevision: 'fecha_revision',
      motivoRechazo: 'motivo_rechazo',
      estado: 'estado',
      genero: 'genero',
      correo: 'correo'
    };

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && fieldMappings[key]) {
        fields.push(`${fieldMappings[key]} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE solicitud_ingreso
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING 
        id, nombre_completo as "nombreCompleto", correo, 
        username_deseado as "usernameDeseado", fecha_nacimiento as "fechaNacimiento", 
        genero, foto_url as "fotoUrl", nivel_salud_declarado as "nivelSaludDeclarado", 
        experiencias_previas as "experienciasPrevias", condicion_fisica as "condicionFisica", 
        habilidades_declaradas as "habilidadesDeclaradas", campamento_id as "campamentoId", 
        estado, oficio_sugerido_id as "oficioSugeridoId", revisado_por as "revisadoPor", 
        fecha_revision as "fechaRevision", motivo_rechazo as "motivoRechazo", 
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM solicitud_ingreso WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async countByCampAndStatus(campamentoId: string, estado: AdmissionRequestStatus): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM solicitud_ingreso
      WHERE campamento_id = $1 AND estado = $2
    `;

    const result = await this.pool.query(query, [campamentoId, estado]);
    return parseInt(result.rows[0].count);
  }

  async findByEmail(correo: string): Promise<AdmissionRequest | null> {
    const query = `
      SELECT 
        id, nombre_completo as "nombreCompleto", correo, 
        username_deseado as "usernameDeseado", fecha_nacimiento as "fechaNacimiento", 
        genero, foto_url as "fotoUrl", nivel_salud_declarado as "nivelSaludDeclarado", 
        experiencias_previas as "experienciasPrevias", condicion_fisica as "condicionFisica", 
        habilidades_declaradas as "habilidadesDeclaradas", campamento_id as "campamentoId", 
        estado, oficio_sugerido_id as "oficioSugeridoId", revisado_por as "revisadoPor", 
        fecha_revision as "fechaRevision", motivo_rechazo as "motivoRechazo", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM solicitud_ingreso
      WHERE correo = $1
    `;

    const result = await this.pool.query(query, [correo]);
    return result.rows[0] || null;
  }
}