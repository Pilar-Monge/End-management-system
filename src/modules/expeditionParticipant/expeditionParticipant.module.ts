import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpeditionEntity } from '../expedition/expedition.entity';
import { PersonEntity } from '../person/person.entity';
import { ExpeditionParticipantController } from './expeditionParticipant.controller';
import { ExpeditionParticipantEntity } from './expeditionParticipant.entity';
import { ExpeditionParticipantRepository } from './expeditionParticipant.repository';
import { ExpeditionParticipantService } from './expeditionParticipant.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpeditionParticipantEntity, ExpeditionEntity, PersonEntity]),
    NotificationModule,
  ],
  controllers: [ExpeditionParticipantController],
  providers: [ExpeditionParticipantRepository, ExpeditionParticipantService],
})
export class ExpeditionParticipantModule {}
