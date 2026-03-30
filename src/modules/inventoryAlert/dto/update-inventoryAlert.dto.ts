import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryAlertDto {
  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  amountAtAlertGeneration?: string;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;

  @ApiPropertyOptional()
  alertDate?: Date;

  @ApiPropertyOptional()
  resolved?: boolean;

  @ApiPropertyOptional({ nullable: true })
  resolutionDate?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  resolvedBy?: number | null;

}