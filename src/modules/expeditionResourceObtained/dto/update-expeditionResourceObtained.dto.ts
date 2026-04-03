import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExpeditionResourceObtainedDto {
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
