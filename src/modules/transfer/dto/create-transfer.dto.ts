import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { TransferStatus } from '../transfer.model';

export class CreateTransferDto {
  @ApiProperty()
  requestId!: number;

  @ApiProperty()
  plannedDepartureDate!: Date;

  @ApiPropertyOptional({ nullable: true })
  actualDepartureDate?: Date | null;

  @ApiProperty()
  plannedArrivalDate!: Date;

  @ApiPropertyOptional({ nullable: true })
  actualArrivalDate?: Date | null;

  @ApiPropertyOptional()
  status?: TransferStatus;

  @ApiPropertyOptional({ nullable: true })
  departureApprovedBy?: number | null;

  @ApiPropertyOptional({ nullable: true })
  arrivalApprovedBy?: number | null;

  @ApiPropertyOptional()
  rationsForTrip?: string;

  @ApiPropertyOptional({ nullable: true })
  receptionNotes?: string | null;
}
