import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { ACCESS_LOG_EVENT_TYPE_VALUES, type AccessLogEventType } from './accessLog.model';

@Entity({ name: 'access_log' })
@Check(
  'chk_log_tipo',
  `"event_type" IN (
    'LOGIN',
    'LOGOUT',
    'INACTIVITY_EXPIRATION',
    'LOCKOUT',
    'CAMP_CHANGE',
    'FAILED_ATTEMPT',
    'PASSWORD_RESET_REQUEST',
    'PASSWORD_RESET_COMPLETED'
  )`,
)
@Index('idx_log_acceso_usuario', ['userId'])
@Index('idx_log_acceso_fecha', ['eventDate'])
export class AccessLogEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'session_id', type: 'int', nullable: true })
  @ApiProperty({ nullable: true })
  sessionId!: number | null;

  @Column({ name: 'user_id', type: 'int' })
  @ApiProperty()
  userId!: number;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({
    name: 'event_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  eventDate!: Date;

  @Column({ name: 'event_type', type: 'text' })
  @ApiProperty({ enum: ACCESS_LOG_EVENT_TYPE_VALUES })
  eventType!: AccessLogEventType;

  @Column({ name: 'source_ip', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  sourceIp!: string | null;

  @Column({ name: 'detail', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  detail!: string | null;
}
