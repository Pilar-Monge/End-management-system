import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExpeditionResourceConsumedDto {
  @ApiPropertyOptional()
  expeditionId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  amount?: string;

  @ApiPropertyOptional()
  recordedBy?: number;

  @ApiPropertyOptional()
  recordDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;
}
