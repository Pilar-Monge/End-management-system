export const PERSON_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'SICK',
  'INJURED',
  'OUTSIDE_CAMP',
  'ON_EXPEDITION',
] as const;

export type PersonStatus = (typeof PERSON_STATUS_VALUES)[number];

export interface PersonStatusHistory {
  id: number;
  personId: number;
  previousStatus: PersonStatus;
  newStatus: PersonStatus;
  changeDate: Date;
  reason: string | null;
  changedBy: number;
}

export interface CreatePersonStatusHistoryDTO {
  personId: number;
  previousStatus: PersonStatus;
  newStatus: PersonStatus;
  reason?: string | null;
  changedBy: number;
}

export interface UpdatePersonStatusHistoryDTO {
  personId?: number;
  previousStatus?: PersonStatus;
  newStatus?: PersonStatus;
  changeDate?: Date;
  reason?: string | null;
  changedBy?: number;
}
