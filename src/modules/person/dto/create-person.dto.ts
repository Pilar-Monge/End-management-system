import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

import type { Gender } from '../person.model';

export class CreatePersonDto {
  @ApiPropertyOptional({ nullable: true })
  admissionRequestId?: number | null;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  lastName1!: string;

  @ApiPropertyOptional({ nullable: true })
  lastName2?: string | null;

  @ApiProperty()
  identificationNumber!: string;

  @ApiProperty()
  birthDate!: Date;

  @ApiProperty()
  gender!: Gender;

  @ApiPropertyOptional({ nullable: true })
  initialHealthLevel?: string | null;

  @ApiPropertyOptional({ nullable: true })
  previousExperience?: string | null;

  @ApiPropertyOptional({ nullable: true })
  physicalConditionAtEntry?: string | null;

  @ApiPropertyOptional({ nullable: true })
  imageUrl?: string | null;

  @ApiProperty()
  campId!: number;

  @ApiPropertyOptional({ nullable: true })
  occupationId?: number | null;
  @ApiProperty({
    description: 'Personaje visual (1, 2, 3, 4 o 5)',
    minimum: 1,
    maximum: 5,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  character!: number;
}
