export interface CampInventory {
  campId: number;
  resourceTypeId: number;
  currentAmount: string;
  minimumAlertAmount: string;
  lastUpdate: Date;
}

export interface CreateCampInventoryDTO {
  campId: number;
  resourceTypeId: number;
  currentAmount?: string;
  minimumAlertAmount?: string;
}

export interface UpdateCampInventoryDTO {
  currentAmount?: string;
  minimumAlertAmount?: string;
}
