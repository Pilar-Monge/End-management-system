import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { type AccessLogEventType } from './accessLog.model';

@Entity({ name: 'access_log' })
@Check(
  'chk_log_tipo',
  `"event_type" IN (
    'LOGIN',
    'LOGOUT',
    'INACTIVITY_EXPIRATION',
    'LOCKOUT',
    'CAMP_CHANGE',
    'FAILED_ATTEMPT'
  )`,
)
@Index('idx_log_acceso_usuario', ['userId'])
@Index('idx_log_acceso_fecha', ['eventDate'])
export class AccessLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'session_id', type: 'int', nullable: true })
  sessionId!: number | null;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({
    name: 'event_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  eventDate!: Date;

  @Column({ name: 'event_type', type: 'text' })
  eventType!: AccessLogEventType;

  @Column({ name: 'source_ip', type: 'text', nullable: true })
  sourceIp!: string | null;

  @Column({ name: 'detail', type: 'text', nullable: true })
  detail!: string | null;
}
