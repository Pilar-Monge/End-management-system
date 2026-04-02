import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { Gender } from '../person.model';

export class CreatePersonDto {
  @ApiPropertyOptional({ nullable: true })
  admissionRequestId?: number | null;

  @ApiProperty()
  name!:  string;

  @ApiProperty()
  lastName1!:  string;

  @ApiPropertyOptional({ nullable: true })
  lastName2?: string | null;

  @ApiProperty()
  identificationNumber!:  string;

  @ApiProperty()
  birthDate!:  Date;

  @ApiProperty()
  gender!:  Gender;

  @ApiPropertyOptional({ nullable: true })
  initialHealthLevel?: string | null;

  @ApiPropertyOptional({ nullable: true })
  previousExperience?: string | null;

  @ApiPropertyOptional({ nullable: true })
  physicalConditionAtEntry?: string | null;

  @ApiPropertyOptional({ nullable: true })
  imageUrl?: string | null;

  @ApiProperty()
  campId!:  number;

  @ApiPropertyOptional({ nullable: true })
  occupationId?: number | null;

}