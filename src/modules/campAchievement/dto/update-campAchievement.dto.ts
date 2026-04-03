import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampAchievementDto {
  @ApiPropertyOptional()
  obtainedDate?: Date;

  @ApiPropertyOptional()
  unlockedBy?: number;

  @ApiPropertyOptional({ nullable: true })
  unlockContext?: string | null;
}
