import { Injectable } from '@nestjs/common';
import { pool } from "../../config/database";
import { User, CreateUserDBDTO, UpdateUserDTO } from "./user.model";

@Injectable()
export class UserRepository {
  async create(userData: CreateUserDBDTO): Promise<User> {
    const query = `
      INSERT INTO usuario_sistema (
        persona_id,
        solicitud_id,
        username,
        password_hash,
        correo,
        nombre_completo,
        rol,
        estado,
        campamento_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        id,
        persona_id as "personaId",
        solicitud_id as "solicitudId",
        username,
        password_hash as "passwordHash",
        correo,
        nombre_completo as "nombreCompleto",
        rol,
        estado,
        campamento_id as "campamentoId",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const values = [
      userData.personaId,
      userData.solicitudId,
      userData.username,
      userData.passwordHash,
      userData.correo,
      userData.nombreCompleto,
      userData.rol || 'VISITANTE',
      userData.estado || 'ACTIVO',
      userData.campamentoId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT 
        id,
        persona_id as "personaId",
        solicitud_id as "solicitudId",
        username,
        password_hash as "passwordHash",
        correo,
        nombre_completo as "nombreCompleto",
        rol,
        estado,
        campamento_id as "campamentoId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM usuario_sistema
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT 
        id,
        persona_id as "personaId",
        solicitud_id as "solicitudId",
        username,
        password_hash as "passwordHash",
        correo,
        nombre_completo as "nombreCompleto",
        rol,
        estado,
        campamento_id as "campamentoId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM usuario_sistema
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUsername(username: string, campamentoId: string): Promise<User | null> {
    const query = `
      SELECT 
        id,
        persona_id as "personaId",
        solicitud_id as "solicitudId",
        username,
        password_hash as "passwordHash",
        correo,
        nombre_completo as "nombreCompleto",
        rol,
        estado,
        campamento_id as "campamentoId",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM usuario_sistema
      WHERE username = $1 AND campamento_id = $2
    `;
    
    const result = await pool.query(query, [username, campamentoId]);
    return result.rows[0] || null;
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.personaId) {
      updates.push(`persona_id = $${paramCount++}`);
      values.push(userData.personaId);
    }
    if (userData.solicitudId) {
      updates.push(`solicitud_id = $${paramCount++}`);
      values.push(userData.solicitudId);
    }
    if (userData.username) {
      updates.push(`username = $${paramCount++}`);
      values.push(userData.username);
    }
    if (userData.passwordHash) {
      updates.push(`password_hash = $${paramCount++}`);
      values.push(userData.passwordHash);
    }
    if (userData.correo) {
      updates.push(`correo = $${paramCount++}`);
      values.push(userData.correo);
    }
    if (userData.nombreCompleto) {
      updates.push(`nombre_completo = $${paramCount++}`);
      values.push(userData.nombreCompleto);
    }
    if (userData.rol) {
      updates.push(`rol = $${paramCount++}`);
      values.push(userData.rol);
    }
    if (userData.estado) {
      updates.push(`estado = $${paramCount++}`);
      values.push(userData.estado);
    }
    if (userData.campamentoId) {
      updates.push(`campamento_id = $${paramCount++}`);
      values.push(userData.campamentoId);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE usuario_sistema 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id,
        persona_id as "personaId",
        solicitud_id as "solicitudId",
        username,
        password_hash as "passwordHash",
        correo,
        nombre_completo as "nombreCompleto",
        rol,
        estado,
        campamento_id as "campamentoId",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM usuario_sistema WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async countByCampamento(campamentoId: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM usuario_sistema WHERE campamento_id = $1`;
    const result = await pool.query(query, [campamentoId]);
    return parseInt(result.rows[0].count);
  }
}