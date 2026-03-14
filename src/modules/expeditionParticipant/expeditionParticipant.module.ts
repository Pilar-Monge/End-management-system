import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpeditionParticipantController } from './expeditionParticipant.controller';
import { ExpeditionParticipantEntity } from './expeditionParticipant.entity';
import { ExpeditionParticipantRepository } from './expeditionParticipant.repository';
import { ExpeditionParticipantService } from './expeditionParticipant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpeditionParticipantEntity])],
  controllers: [ExpeditionParticipantController],
  providers: [ExpeditionParticipantRepository, ExpeditionParticipantService],
})
export class ExpeditionParticipantModule {}
