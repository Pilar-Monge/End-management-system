import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDailyCollectionRecordDto {
  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  date?: Date;

  @ApiPropertyOptional()
  expectedAmount?: string;

  @ApiPropertyOptional()
  actualAmount?: string;

  @ApiPropertyOptional({ nullable: true })
  differenceReason?: string | null;

  @ApiPropertyOptional()
  recordedBy?: number;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;

}