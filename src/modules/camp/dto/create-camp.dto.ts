import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { CampStatus } from '../camp.model';

export class CreateCampDto {
  @ApiProperty()
  name!:  string;

  @ApiProperty()
  latitude!:  string;

  @ApiProperty()
  longitude!:  string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional()
  status?: CampStatus;

  @ApiProperty()
  foundationDate!:  Date;

  @ApiPropertyOptional()
  maxPersonCapacity?: number;

  @ApiPropertyOptional()
  sessionInactivityMinutes?: number;

  @ApiPropertyOptional()
  minimumDailyRationPerPerson?: string;

  @ApiPropertyOptional()
  stockAlertThresholdPercentage?: string;

}