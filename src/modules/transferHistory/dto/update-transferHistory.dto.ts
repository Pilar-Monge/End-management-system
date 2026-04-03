import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { TransferStatus } from '../../transfer/transfer.model';

export class UpdateTransferHistoryDto {
  @ApiPropertyOptional()
  transferId?: number;

  @ApiPropertyOptional()
  previousStatus?: TransferStatus;

  @ApiPropertyOptional()
  newStatus?: TransferStatus;

  @ApiPropertyOptional()
  date?: Date;

  @ApiPropertyOptional()
  userId?: number;

  @ApiPropertyOptional({ nullable: true })
  comment?: string | null;
}
