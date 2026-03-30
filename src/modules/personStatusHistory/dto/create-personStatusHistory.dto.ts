import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { PersonStatus } from '../personStatusHistory.model';

export class CreatePersonStatusHistoryDto {
  @ApiProperty()
  personId!:  number;

  @ApiProperty()
  previousStatus!:  PersonStatus;

  @ApiProperty()
  newStatus!:  PersonStatus;

  @ApiPropertyOptional({ nullable: true })
  reason?: string | null;

  @ApiProperty()
  changedBy!:  number;

}