import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpeditionResourceConsumedController } from './expeditionResourceConsumed.controller';
import { ExpeditionResourceConsumedEntity } from './expeditionResourceConsumed.entity';
import { ExpeditionResourceConsumedRepository } from './expeditionResourceConsumed.repository';
import { ExpeditionResourceConsumedService } from './expeditionResourceConsumed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpeditionResourceConsumedEntity])],
  controllers: [ExpeditionResourceConsumedController],
  providers: [ExpeditionResourceConsumedRepository, ExpeditionResourceConsumedService],
})
export class ExpeditionResourceConsumedModule {}
