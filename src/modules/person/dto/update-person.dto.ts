import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import type { PersonStatus } from '../person.model';

const PersonStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SICK: 'SICK',
  INJURED: 'INJURED',
  OUTSIDE_CAMP: 'OUTSIDE_CAMP',
  ON_EXPEDITION: 'ON_EXPEDITION',
} as const;

export class UpdatePersonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PersonStatusEnum)
  currentStatus?: PersonStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  occupationId?: number | null;
}
