export const EMAIL_OUTBOX_STATUS_VALUES = ['PENDING', 'PROCESSING', 'SENT', 'FAILED'] as const;

export type EmailOutboxStatus = (typeof EMAIL_OUTBOX_STATUS_VALUES)[number];

export interface EmailOutbox {
  id: number;
  toEmail: string;
  subject: string;
  templateKey: string;
  payload: Record<string, unknown>;
  status: EmailOutboxStatus;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: Date;
  lastError: string | null;
  sentAt: Date | null;
  createdAt: Date;
}

export interface EnqueueEmailDTO {
  toEmail: string;
  subject: string;
  templateKey: string;
  payload?: Record<string, unknown>;
  maxAttempts?: number;
}
