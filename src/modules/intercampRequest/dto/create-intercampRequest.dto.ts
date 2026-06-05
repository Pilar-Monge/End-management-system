import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import type { IntercampRequestStatus } from '../intercampRequest.model';

export class CreateIntercampRequestDto {
  @ApiProperty()
  @IsInt()
  originCampId!: number;

  @ApiProperty()
  @IsInt()
  destinationCampId!: number;

  @ApiPropertyOptional()
  status?: IntercampRequestStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  description?: string | null;

  @ApiProperty({ required: true, type: String, format: 'date-time' })
  @IsNotEmpty()
  @IsDateString()
  plannedDepartureDate!: string;

  @ApiProperty({ required: true, type: String, format: 'date-time' })
  @IsNotEmpty()
  @IsDateString()
  plannedArrivalDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  responseDate?: Date | null;

  @ApiProperty()
  @IsInt()
  createdBy!: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  respondedBy?: number | null;
}
