export const INVENTORY_MOVEMENT_TYPE_VALUES = [
  'DAILY_COLLECTION',
  'DAILY_RATION',
  'EXPEDITION_DEPARTURE',
  'EXPEDITION_RETURN',
  'TRANSFER_SENT',
  'TRANSFER_RECEIVED',
  'MANUAL_ADJUSTMENT',
] as const;

export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPE_VALUES)[number];

export interface InventoryMovement {
  id: number;
  campId: number;
  resourceTypeId: number;
  amount: string;
  movementType: InventoryMovementType;
  sourceId: number | null;
  sourceType: string | null;
  recordedBy: number;
  date: Date;
  description: string | null;
}

export interface CreateInventoryMovementDTO {
  campId: number;
  resourceTypeId: number;
  amount: string;
  movementType: InventoryMovementType;
  sourceId?: number | null;
  sourceType?: string | null;
  recordedBy: number;
  date?: Date;
  description?: string | null;
}

export interface UpdateInventoryMovementDTO {
  campId?: number;
  resourceTypeId?: number;
  amount?: string;
  movementType?: InventoryMovementType;
  sourceId?: number | null;
  sourceType?: string | null;
  recordedBy?: number;
  date?: Date;
  description?: string | null;
}
