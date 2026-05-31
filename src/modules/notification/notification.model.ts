import type { SystemRole } from '../systemUser/systemUser.model';

export const NOTIFICATION_TYPE_VALUES = [
  'ADMISSION_REQUEST_PENDING',
  'ADMISSION_REQUEST_APPROVED',
  'ADMISSION_REQUEST_REJECTED',
  'ADMISSION_REQUEST_AI_REVIEWED',
  'ROLE_UPDATED',
  'USER_STATUS_UPDATED',
  'INVENTORY_ALERT',
  'OVERPOPULATION_ALERT',
  'INTERCAMP_REQUEST_RECEIVED',
  'INTERCAMP_REQUEST_APPROVED',
  'INTERCAMP_REQUEST_REJECTED',
  'INTERCAMP_REQUEST_CANCELED',
  'EXPEDITION_RETURN',
  'EXPEDITION_STATUS_UPDATED',
  'EXPEDITION_CREATED',
  'EXPEDITION_COMPLETED',
  'EXPEDITION_RESOURCE_CONSUMED',
  'EXPEDITION_RESOURCE_OBTAINED',
  'TRANSFER_PENDING',
  'TRANSFER_COMPLETED',
  'TRANSFER_CANCELED',
  'TRANSFER_EXECUTION_FAILED',
  'TRANSFER_PERSON_UPDATED',
  'REQUEST_PERSON_DETAIL_UPDATED',
  'REQUEST_RESOURCE_DETAIL_UPDATED',
  'TRANSFER_RESOURCE_RECORDED',
  'PERSON_STATUS_CHANGED',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'OCCUPATION_WITHOUT_STAFF',
  'TEMPORARY_OCCUPATION_ASSIGNED',
  'CAMP_ACHIEVEMENT_UNLOCKED',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];

export interface Notification {
  id: number;
  campId: number;
  userId: number | null;
  targetRole: SystemRole | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdDate: Date;
  readDate: Date | null;
  sourceType: string | null;
  sourceId: number | null;
}

export interface CreateNotificationDTO {
  campId: number;
  userId?: number | null;
  targetRole?: SystemRole | null;
  type: NotificationType;
  title: string;
  message: string;
  read?: boolean;
  createdDate?: Date;
  readDate?: Date | null;
  sourceType?: string | null;
  sourceId?: number | null;
}

export interface UpdateNotificationDTO {
  campId?: number;
  userId?: number | null;
  targetRole?: SystemRole | null;
  type?: NotificationType;
  title?: string;
  message?: string;
  read?: boolean;
  createdDate?: Date;
  readDate?: Date | null;
  sourceType?: string | null;
  sourceId?: number | null;
}
