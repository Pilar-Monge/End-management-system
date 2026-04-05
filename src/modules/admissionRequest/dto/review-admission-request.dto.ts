import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class ReviewAdmissionRequestDto {
  @ApiProperty({ example: 3, description: 'Admin user ID who reviews the request' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adminUserId!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  approved!: boolean;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Rejection reason (only used when approved is false)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rejectionReason?: string;
}
