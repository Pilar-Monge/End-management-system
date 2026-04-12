import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../systemUser/systemUser.entity';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './notification.entity';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
