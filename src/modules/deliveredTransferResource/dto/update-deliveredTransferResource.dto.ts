import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeliveredTransferResourceDto {
  @ApiPropertyOptional()
  transferId?: number;

  @ApiPropertyOptional()
  resourceTypeId?: number;

  @ApiPropertyOptional()
  sentAmount?: string;

  @ApiPropertyOptional()
  receivedAmount?: string;

  @ApiPropertyOptional()
  recordedBy?: number;

  @ApiPropertyOptional()
  recordDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  movementId?: number | null;

}