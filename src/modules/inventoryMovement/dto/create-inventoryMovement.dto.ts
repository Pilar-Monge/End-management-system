import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { InventoryMovementType } from '../inventoryMovement.model';

export class CreateInventoryMovementDto {
  @ApiProperty()
  campId!:  number;

  @ApiProperty()
  resourceTypeId!:  number;

  @ApiProperty()
  amount!:  string;

  @ApiProperty()
  movementType!:  InventoryMovementType;

  @ApiPropertyOptional({ nullable: true })
  sourceId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  sourceType?: string | null;

  @ApiProperty()
  recordedBy!:  number;

  @ApiPropertyOptional()
  date?: Date;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

}