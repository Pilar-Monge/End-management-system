export const ACCESS_LOG_EVENT_TYPE_VALUES = [
  'LOGIN',
  'LOGOUT',
  'INACTIVITY_EXPIRATION',
  'LOCKOUT',
  'CAMP_CHANGE',
  'FAILED_ATTEMPT',
  'PASSWORD_RESET_REQUEST',
  'PASSWORD_RESET_COMPLETED',
] as const;

export type AccessLogEventType = (typeof ACCESS_LOG_EVENT_TYPE_VALUES)[number];

export interface AccessLog {
  id: number;
  sessionId: number | null;
  userId: number;
  campId: number;
  eventDate: Date;
  eventType: AccessLogEventType;
  sourceIp: string | null;
  detail: string | null;
}

export interface CreateAccessLogDTO {
  sessionId?: number | null;
  userId: number;
  campId: number;
  eventType: AccessLogEventType;
  eventDate?: Date;
  sourceIp?: string | null;
  detail?: string | null;
}

export interface UpdateAccessLogDTO {
  sessionId?: number | null;
  userId?: number;
  campId?: number;
  eventDate?: Date;
  eventType?: AccessLogEventType;
  sourceIp?: string | null;
  detail?: string | null;
}
