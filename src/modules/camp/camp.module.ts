import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';

import { CampController } from './camp.controller';
import { CampEntity } from './camp.entity';
import { CampRepository } from './camp.repository';
import { CampService } from './camp.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampEntity]), NotificationModule],
  controllers: [CampController],
  providers: [CampRepository, CampService],
  exports: [CampRepository, CampService],
})
export class CampModule {}
