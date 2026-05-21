import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export const ADMISSION_REVIEW_ROLE_VALUES = [
  'WORKER',
  'RESOURCE_MANAGEMENT',
  'TRAVEL_MANAGER',
  'SYSTEM_ADMIN',
] as const;

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
    example: 5,
    description:
      'Final occupation selected by the admin. Required when approved is true; use GET /api/occupations to choose an id. It may differ from the AI suggestion.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  finalOccupationId?: number;

  @ApiPropertyOptional({
    enum: ADMISSION_REVIEW_ROLE_VALUES,
    example: 'RESOURCE_MANAGEMENT',
    description: 'Final system role selected by the admin. Required when approved is true.',
  })
  @IsOptional()
  @IsIn(ADMISSION_REVIEW_ROLE_VALUES)
  finalRole?: (typeof ADMISSION_REVIEW_ROLE_VALUES)[number];

  @ApiPropertyOptional({
    nullable: true,
    description: 'Rejection reason (only used when approved is false)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rejectionReason?: string;
}
