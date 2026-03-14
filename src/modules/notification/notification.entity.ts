import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import {
  SYSTEM_ROLE_VALUES,
  type SystemRole,
} from '../systemUser/systemUser.model';

import {
  NOTIFICATION_TYPE_VALUES,
  type NotificationType,
} from './notification.model';

@Entity({ name: 'notification' })
@Index('idx_notification_camp', ['campId'])
@Index('idx_notificacion_usuario', ['userId', 'read'])
@Check('chk_notificacion_destinatario', `"user_id" IS NOT NULL OR "target_role" IS NOT NULL`)
@Check(
  'chk_notificacion_tipo',
  `"type" IN (${NOTIFICATION_TYPE_VALUES.map((t) => `'${t}'`).join(', ')})`,
)
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'camp_id', type: 'int' })
  campId!: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  @Column({
    name: 'target_role',
    type: 'enum',
    enum: SYSTEM_ROLE_VALUES,
    enumName: 'system_role_enum',
    nullable: true,
  })
  targetRole!: SystemRole | null;

  @Column({ name: 'type', type: 'text' })
  type!: NotificationType;

  @Column({ name: 'title', type: 'text' })
  title!: string;

  @Column({ name: 'message', type: 'text' })
  message!: string;

  @Column({ name: 'read', type: 'boolean', default: false })
  read!: boolean;

  @Column({
    name: 'created_date',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdDate!: Date;

  @Column({ name: 'read_date', type: 'timestamptz', nullable: true })
  readDate!: Date | null;

  @Column({ name: 'source_type', type: 'text', nullable: true })
  sourceType!: string | null;

  @Column({ name: 'source_id', type: 'int', nullable: true })
  sourceId!: number | null;
}
