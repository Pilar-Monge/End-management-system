import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { PersonTransferStatus } from '../transferPerson.model';

export class CreateTransferPersonDto {
  @ApiProperty()
  transferId!: number;

  @ApiProperty()
  personId!: number;

  @ApiPropertyOptional()
  status?: PersonTransferStatus;

  @ApiPropertyOptional({ nullable: true })
  departureDate?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  arrivalDate?: Date | null;
}
