import { ApiPropertyOptional } from '@nestjs/swagger';

import type { InventoryMovementType } from '../inventoryMovement.model';

export class UpdateInventoryMovementDto {
  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  amount?: string;

  @ApiPropertyOptional()
  movementType?: InventoryMovementType;

  @ApiPropertyOptional({ nullable: true })
  sourceId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  sourceType?: string | null;

  @ApiPropertyOptional()
  recordedBy?: number;

  @ApiPropertyOptional()
  date?: Date;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;
}
