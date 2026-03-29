import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class ReviewAdmissionRequestDto {
  @ApiProperty({ example: 3, description: 'ID del usuario admin que revisa' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adminUserId!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  approved!: boolean;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  motivoRechazo?: string;
}
