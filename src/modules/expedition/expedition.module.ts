import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemTimeModule } from '../systemTime/systemTime.module';

import { ExpeditionController } from './expedition.controller';
import { ExpeditionEntity } from './expedition.entity';
import { ExpeditionRepository } from './expedition.repository';
import { ExpeditionService } from './expedition.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpeditionEntity]), SystemTimeModule],
  controllers: [ExpeditionController],
  providers: [ExpeditionRepository, ExpeditionService],
})
export class ExpeditionModule {}
