import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EMAIL_OUTBOX_STATUS_VALUES, type EmailOutboxStatus } from './emailOutbox.model';

@Entity({ name: 'email_outbox' })
@Index('idx_email_outbox_status_next_attempt', ['status', 'nextAttemptAt'])
@Check(
  'chk_email_outbox_status',
  `"status" IN (${EMAIL_OUTBOX_STATUS_VALUES.map((status) => `'${status}'`).join(', ')})`,
)
export class EmailOutboxEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'to_email', type: 'text' })
  toEmail!: string;

  @Column({ name: 'subject', type: 'text' })
  subject!: string;

  @Column({ name: 'template_key', type: 'text' })
  templateKey!: string;

  @Column({
    name: 'payload',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  payload!: Record<string, unknown>;

  @Column({
    name: 'status',
    type: 'text',
    default: 'PENDING',
  })
  status!: EmailOutboxStatus;

  @Column({ name: 'attempts', type: 'int', default: 0 })
  attempts!: number;

  @Column({ name: 'max_attempts', type: 'int', default: 5 })
  maxAttempts!: number;

  @Column({
    name: 'next_attempt_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  nextAttemptAt!: Date;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError!: string | null;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;
}
