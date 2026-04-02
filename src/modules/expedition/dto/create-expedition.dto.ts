import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { ExpeditionStatus } from '../expedition.model';

export class CreateExpeditionDto {
  @ApiProperty()
  campId!:  number;

  @ApiProperty()
  name!:  string;

  @ApiPropertyOptional({ nullable: true })
  objective?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationDescription?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationLatitude?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationLongitude?: string | null;

  @ApiProperty()
  plannedDepartureDate!:  Date;

  @ApiPropertyOptional({ nullable: true })
  actualDepartureDate?: Date | null;

  @ApiProperty()
  plannedReturnDate!:  Date;

  @ApiPropertyOptional({ nullable: true })
  actualReturnDate?: Date | null;

  @ApiPropertyOptional()
  extraDaysAvailable?: number;

  @ApiPropertyOptional()
  extraDaysUsed?: number;

  @ApiPropertyOptional()
  status?: ExpeditionStatus;

}