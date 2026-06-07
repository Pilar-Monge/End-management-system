import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { Gender, PersonStatus } from '../person.model';

const PersonStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SICK: 'SICK',
  INJURED: 'INJURED',
  OUTSIDE_CAMP: 'OUTSIDE_CAMP',
  ON_EXPEDITION: 'ON_EXPEDITION',
} as const;

const GenderEnum = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export class UpdatePersonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName1?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  lastName2?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiPropertyOptional({ enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PersonStatusEnum)
  currentStatus?: PersonStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  occupationId?: number | null;

  @ApiPropertyOptional({ description: 'Personaje visual (1, 2, 3, 4 o 5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  character?: number;
}
