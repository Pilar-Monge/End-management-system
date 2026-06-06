import { Check, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import {
  PASSWORD_RESET_TOKEN_STATUS_VALUES,
  type PasswordResetTokenStatus,
} from './passwordResetToken.model';

@Entity({ name: 'password_reset_token' })
@Index('idx_password_reset_user_status', ['userId', 'status'])
@Index('idx_password_reset_token_hash', ['tokenHash'])
@Check(
  'chk_password_reset_token_status',
  `"status" IN (${PASSWORD_RESET_TOKEN_STATUS_VALUES.map((status) => `'${status}'`).join(', ')})`,
)
@Check(
  'chk_password_reset_used',
  `("status" = 'USED' AND "used_at" IS NOT NULL) OR ("status" <> 'USED')`,
)
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'token_hash', type: 'text' })
  tokenHash!: string;

  @Column({ name: 'code_hash', type: 'text', default: '' })
  codeHash!: string;

  @Column({ name: 'status', type: 'text', default: 'ACTIVE' })
  status!: PasswordResetTokenStatus;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'attempts', type: 'int', default: 0 })
  attempts!: number;

  @Column({ name: 'max_attempts', type: 'int', default: 5 })
  maxAttempts!: number;

  @Column({ name: 'used_at', type: 'timestamptz', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  createdAt!: Date;

  @Column({ name: 'request_ip', type: 'text', nullable: true })
  requestIp!: string | null;
}
