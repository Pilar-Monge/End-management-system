export interface DeliveredTransferResource {
  id: number;
  transferId: number;
  resourceTypeId: number;
  sentAmount: string;
  receivedAmount: string;
  recordedBy: number;
  recordDate: Date;
  movementId: number | null;
}

export interface CreateDeliveredTransferResourceDTO {
  transferId: number;
  resourceTypeId: number;
  sentAmount: string;
  receivedAmount: string;
  recordedBy: number;
  recordDate?: Date;
  movementId?: number | null;
}

export interface UpdateDeliveredTransferResourceDTO {
  transferId?: number;
  resourceTypeId?: number;
  sentAmount?: string;
  receivedAmount?: string;
  recordedBy?: number;
  recordDate?: Date;
  movementId?: number | null;
}
