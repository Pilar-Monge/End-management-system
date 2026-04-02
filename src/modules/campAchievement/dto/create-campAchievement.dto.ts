import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampAchievementDto {
  @ApiProperty()
  campId!:  number;

  @ApiProperty()
  achievementId!:  number;

  @ApiPropertyOptional()
  obtainedDate?: Date;

  @ApiProperty()
  unlockedBy!:  number;

  @ApiPropertyOptional({ nullable: true })
  unlockContext?: string | null;

}