export interface InventoryAlert {
  id: number;
  campId: number;
  resourceTypeId: number;
  amountAtAlertGeneration: string;
  movementId: number | null;
  alertDate: Date;
  resolved: boolean;
  resolutionDate: Date | null;
  resolvedBy: number | null;
}

export interface CreateInventoryAlertDTO {
  campId: number;
  resourceTypeId: number;
  amountAtAlertGeneration: string;
  movementId?: number | null;
  alertDate?: Date;
  resolved?: boolean;
  resolutionDate?: Date | null;
  resolvedBy?: number | null;
}

export interface UpdateInventoryAlertDTO {
  campId?: number;
  resourceTypeId?: number;
  amountAtAlertGeneration?: string;
  movementId?: number | null;
  alertDate?: Date;
  resolved?: boolean;
  resolutionDate?: Date | null;
  resolvedBy?: number | null;
}
