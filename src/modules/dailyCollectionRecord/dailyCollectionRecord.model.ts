export interface DailyCollectionRecord {
  id: number;
  campId: number;
  personId: number;
  resourceTypeId: number;
  date: Date;
  expectedAmount: string;
  actualAmount: string;
  differenceReason: string | null;
  recordedBy: number;
  movementId: number | null;
}

export interface CreateDailyCollectionRecordDTO {
  campId: number;
  personId: number;
  resourceTypeId: number;
  date: Date;
  expectedAmount?: string;
  actualAmount?: string;
  differenceReason?: string | null;
  recordedBy: number;
  movementId?: number | null;
}

export interface UpdateDailyCollectionRecordDTO {
  campId?: number;
  personId?: number;
  resourceTypeId?: number;
  date?: Date;
  expectedAmount?: string;
  actualAmount?: string;
  differenceReason?: string | null;
  recordedBy?: number;
  movementId?: number | null;
}

export interface AdjustDailyCollectionRecordDTO {
  actualAmount: string;
  differenceReason?: string | null;
  recordedBy: number;
}
