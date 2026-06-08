export const PASSWORD_RESET_TOKEN_STATUS_VALUES = ['ACTIVE', 'USED', 'EXPIRED'] as const;

export type PasswordResetTokenStatus = (typeof PASSWORD_RESET_TOKEN_STATUS_VALUES)[number];

export interface PasswordResetToken {
  id: number;
  userId: number;
  tokenHash: string;
  codeHash: string;
  status: PasswordResetTokenStatus;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  usedAt: Date | null;
  createdAt: Date;
  requestIp: string | null;
}
