import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { TransferStatus } from '../../transfer/transfer.model';

export class CreateTransferHistoryDto {
  @ApiProperty()
  transferId!: number;

  @ApiProperty()
  previousStatus!: TransferStatus;

  @ApiProperty()
  newStatus!: TransferStatus;

  @ApiPropertyOptional()
  date?: Date;

  @ApiProperty()
  userId!: number;

  @ApiPropertyOptional({ nullable: true })
  comment?: string | null;
}
