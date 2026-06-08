import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { SESSION_STATUS_VALUES, type SessionStatus } from './session.model';

@Entity({ name: 'session' })
@Unique('uq_sesion_token', ['token'])
@Index('idx_sesion_usuario_id', ['userId'])
@Index('idx_sesion_estado', ['status'])
@Index('idx_sesion_ultima_actividad', ['lastActivityDate'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column({ name: 'token', type: 'varchar', length: 64 })
  @ApiProperty()
  token!: string;

  @Column({ name: 'user_id', type: 'int' })
  @ApiProperty()
  userId!: number;

  @Column({ name: 'camp_id', type: 'int' })
  @ApiProperty()
  campId!: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  startDate!: Date;

  @Column({
    name: 'last_activity_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  @ApiProperty()
  lastActivityDate!: Date;

  @Column({ name: 'expiration_date', type: 'timestamptz' })
  @ApiProperty()
  expirationDate!: Date;

  @Column({ name: 'source_ip', type: 'text', nullable: true })
  @ApiProperty({ nullable: true })
  sourceIp!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SESSION_STATUS_VALUES,
    enumName: 'session_status_enum',
    default: 'ACTIVE',
  })
  @ApiProperty({ enum: SESSION_STATUS_VALUES })
  status!: SessionStatus;
}
