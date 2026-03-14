export interface ExpeditionResourceConsumed {
  id: number;
  expeditionId: number;
  resourceTypeId: number;
  amount: string;
  recordedBy: number;
  recordDate: Date;
  movementId: number | null;
}

export interface CreateExpeditionResourceConsumedDTO {
  expeditionId: number;
  resourceTypeId: number;
  amount: string;
  recordedBy: number;
  recordDate?: Date;
  movementId?: number | null;
}

export interface UpdateExpeditionResourceConsumedDTO {
  expeditionId?: number;
  resourceTypeId?: number;
  amount?: string;
  recordedBy?: number;
  recordDate?: Date;
  movementId?: number | null;
}
