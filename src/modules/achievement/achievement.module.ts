import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchievementController } from './achievement.controller';
import { AchievementEntity } from './achievement.entity';
import { AchievementRepository } from './achievement.repository';
import { AchievementService } from './achievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementEntity])],
  controllers: [AchievementController],
  providers: [AchievementRepository, AchievementService],
})
export class AchievementModule {}
