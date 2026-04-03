import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { CampStatus } from '../camp.model';

export class UpdateCampDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  latitude?: string;

  @ApiPropertyOptional()
  longitude?: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  status?: CampStatus;

  @ApiPropertyOptional()
  foundationDate?: Date;

  @ApiPropertyOptional()
  maxPersonCapacity?: number;

  @ApiPropertyOptional()
  sessionInactivityMinutes?: number;

  @ApiPropertyOptional()
  minimumDailyRationPerPerson?: string;

  @ApiPropertyOptional()
  stockAlertThresholdPercentage?: string;
}
