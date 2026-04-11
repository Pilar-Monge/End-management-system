import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { ExpeditionStatus } from '../expedition.model';

export class UpdateExpeditionDto {
  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ nullable: true })
  objective?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationDescription?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationLatitude?: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinationLongitude?: string | null;

  @ApiPropertyOptional()
  plannedDepartureDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  actualDepartureDate?: Date | null;

  @ApiPropertyOptional()
  plannedReturnDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  actualReturnDate?: Date | null;

  @ApiPropertyOptional()
  extraDaysAvailable?: number;

  @ApiPropertyOptional()
  extraDaysUsed?: number;

  @ApiPropertyOptional()
  status?: ExpeditionStatus;

  @ApiPropertyOptional()
  estimatedDurationDays?: number;

  @ApiPropertyOptional()
  maxExtraDays?: number;
}
