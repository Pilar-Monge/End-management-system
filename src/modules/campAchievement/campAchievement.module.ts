import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { CampAchievementController } from './campAchievement.controller';
import { CampAchievementEntity } from './campAchievement.entity';
import { CampAchievementRepository } from './campAchievement.repository';
import { CampAchievementService } from './campAchievement.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampAchievementEntity]), NotificationModule],
  controllers: [CampAchievementController],
  providers: [CampAchievementRepository, CampAchievementService],
})
export class CampAchievementModule {}
