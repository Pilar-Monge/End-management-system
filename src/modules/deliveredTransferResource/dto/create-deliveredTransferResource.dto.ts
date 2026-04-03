import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliveredTransferResourceDto {
  @ApiProperty()
  transferId!: number;

  @ApiProperty()
  resourceTypeId!: number;

  @ApiProperty()
  sentAmount!: string;

  @ApiProperty()
  receivedAmount!: string;

  @ApiProperty()
  recordedBy!: number;

  @ApiPropertyOptional()
  recordDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;
}
