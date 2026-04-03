import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { Gender, PersonStatus } from '../person.model';

export class UpdatePersonDto {
  @ApiPropertyOptional({ nullable: true })
  admissionRequestId?: number | null;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  lastName1?: string;

  @ApiPropertyOptional({ nullable: true })
  lastName2?: string | null;

  @ApiPropertyOptional()
  identificationNumber?: string;

  @ApiPropertyOptional()
  birthDate?: Date;

  @ApiPropertyOptional()
  gender?: Gender;

  @ApiPropertyOptional({ nullable: true })
  initialHealthLevel?: string | null;

  @ApiPropertyOptional({ nullable: true })
  previousExperience?: string | null;

  @ApiPropertyOptional({ nullable: true })
  physicalConditionAtEntry?: string | null;

  @ApiPropertyOptional()
  currentStatus?: PersonStatus;

  @ApiPropertyOptional({ nullable: true })
  imageUrl?: string | null;

  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional({ nullable: true })
  occupationId?: number | null;
}
