import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { SESSION_STATUS_VALUES, type SessionStatus } from './session.model';

@Entity({ name: 'session' })
@Unique('uq_sesion_token', ['token'])
@Index('idx_sesion_usuario_id', ['userId'])
@Index('idx_sesion_estado', ['status'])
@Index('idx_sesion_ultima_actividad', ['lastActivityDate'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'token', type: 'text' })
  token!: string;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  startDate!: Date;

  @Column({
    name: 'last_activity_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  lastActivityDate!: Date;

  @Column({ name: 'expiration_date', type: 'timestamptz' })
  expirationDate!: Date;

  @Column({ name: 'source_ip', type: 'text', nullable: true })
  sourceIp!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SESSION_STATUS_VALUES,
    enumName: 'session_status_enum',
    default: 'ACTIVE',
  })
  status!: SessionStatus;
}
