import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { PersonTransferStatus } from '../transferPerson.model';

export class UpdateTransferPersonDto {
  @ApiPropertyOptional()
  transferId?: number;

  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional()
  status?: PersonTransferStatus;

  @ApiPropertyOptional({ nullable: true })
  departureDate?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  arrivalDate?: Date | null;
}
