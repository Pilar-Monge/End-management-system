import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

import { GENDER_VALUES, type Gender } from '../admissionRequest.model';

export class CreateAdmissionRequestDto {
  @ApiProperty({ example: 'Mario' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Hugo' })
  @IsString()
  @IsNotEmpty()
  lastName1!: string;

  @ApiPropertyOptional({ example: 'García', nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  lastName2?: string | null;

  @ApiProperty({ example: 'mario.hugo@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'marioh' })
  @IsString()
  @IsNotEmpty()
  desiredUsername!: string;

  @ApiProperty({ example: '2000-01-31', description: 'Date in ISO format (YYYY-MM-DD)' })
  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @ApiProperty({ enum: GENDER_VALUES, example: 'MALE' })
  @IsIn(GENDER_VALUES)
  gender!: Gender;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  photoUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  declaredHealthLevel?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  previousExperience?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  physicalCondition?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== undefined && value !== null)
  @IsString()
  @IsNotEmpty()
  declaredSkills?: string | null;

  @ApiProperty({ example: 1, description: 'Camp ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  campId!: number;
}
