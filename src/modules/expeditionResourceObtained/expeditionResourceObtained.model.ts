export interface ExpeditionResourceObtained {
  id: number;
  expeditionId: number;
  resourceTypeId: number;
  amount: string;
  recordedBy: number;
  recordDate: Date;
  movementId: number | null;
}

export interface CreateExpeditionResourceObtainedDTO {
  expeditionId: number;
  resourceTypeId: number;
  amount: string;
  recordedBy: number;
  recordDate?: Date;
  movementId?: number | null;
}

export interface UpdateExpeditionResourceObtainedDTO {
  expeditionId?: number;
  resourceTypeId?: number;
  amount?: string;
  recordedBy?: number;
  recordDate?: Date;
  movementId?: number | null;
}
