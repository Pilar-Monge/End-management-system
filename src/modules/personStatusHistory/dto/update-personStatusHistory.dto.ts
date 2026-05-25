import { ApiPropertyOptional } from '@nestjs/swagger';

import type { PersonStatus } from '../personStatusHistory.model';

export class UpdatePersonStatusHistoryDto {
  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional()
  previousStatus?: PersonStatus;

  @ApiPropertyOptional()
  newStatus?: PersonStatus;

  @ApiPropertyOptional()
  changeDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  reason?: string | null;

  @ApiPropertyOptional()
  changedBy?: number;
}
