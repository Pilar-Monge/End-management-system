export interface Occupation {
  id: number;
  name: string;
  description: string | null;
  collectsResources: boolean;
  participatesInExpeditions: boolean;
  resourceTypeId: number | null;
  dailyAmountProduced: string;
  dailyRationConsumed: string;
  createdAt: Date;
}

export interface CreateOccupationDTO {
  name: string;
  description?: string | null;
  collectsResources?: boolean;
  participatesInExpeditions?: boolean;
  resourceTypeId?: number | null;
  dailyAmountProduced?: string;
  dailyRationConsumed?: string;
}

export interface UpdateOccupationDTO {
  name?: string;
  description?: string | null;
  collectsResources?: boolean;
  participatesInExpeditions?: boolean;
  resourceTypeId?: number | null;
  dailyAmountProduced?: string;
  dailyRationConsumed?: string;
}
