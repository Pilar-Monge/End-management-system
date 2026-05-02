import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from '../email/email.module';
import { SystemTimeModule } from '../systemTime/systemTime.module';
import { UserEntity } from '../systemUser/systemUser.entity';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './notification.entity';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity]), EmailModule, SystemTimeModule],
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
