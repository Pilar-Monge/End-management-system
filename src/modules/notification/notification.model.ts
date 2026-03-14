import type { SystemRole } from '../systemUser/systemUser.model';

export const NOTIFICATION_TYPE_VALUES = [
  'ADMISSION_REQUEST_PENDING',
  'ADMISSION_REQUEST_APPROVED',
  'ADMISSION_REQUEST_REJECTED',
  'ROLE_UPDATED',
  'INVENTORY_ALERT',
  'OVERPOPULATION_ALERT',
  'INTERCAMP_REQUEST_RECEIVED',
  'INTERCAMP_REQUEST_APPROVED',
  'INTERCAMP_REQUEST_REJECTED',
  'EXPEDITION_RETURN',
  'TRANSFER_PENDING',
  'TRANSFER_COMPLETED',
  'OCCUPATION_WITHOUT_STAFF',
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
