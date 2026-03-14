export const SESSION_STATUS_VALUES = ['ACTIVE', 'EXPIRED', 'CLOSED'] as const;

export type SessionStatus = (typeof SESSION_STATUS_VALUES)[number];

export interface Session {
  id: number;
  token: string;
  userId: number;
  campId: number;
  startDate: Date;
  lastActivityDate: Date;
  expirationDate: Date;
  sourceIp: string | null;
  status: SessionStatus;
}

export interface CreateSessionDTO {
  token: string;
  userId: number;
  campId: number;
  expirationDate: Date;
  startDate?: Date;
  lastActivityDate?: Date;
  sourceIp?: string | null;
  status?: SessionStatus;
}

export interface UpdateSessionDTO {
  token?: string;
  userId?: number;
  campId?: number;
  startDate?: Date;
  lastActivityDate?: Date;
  expirationDate?: Date;
  sourceIp?: string | null;
  status?: SessionStatus;
}
