import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDailyCollectionRecordDto {
  @ApiProperty()
  campId!:  number;

  @ApiProperty()
  personId!:  number;

  @ApiProperty()
  resourceTypeId!:  number;

  @ApiProperty()
  date!:  Date;

  @ApiPropertyOptional()
  expectedAmount?: string;

  @ApiPropertyOptional()
  actualAmount?: string;

  @ApiPropertyOptional({ nullable: true })
  differenceReason?: string | null;

  @ApiProperty()
  recordedBy!:  number;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;

}