import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustDailyCollectionRecordDto {
  @ApiProperty()
  actualAmount!: string;

  @ApiPropertyOptional({ nullable: true })
  differenceReason?: string | null;

  @ApiProperty()
  recordedBy!: number;
}
