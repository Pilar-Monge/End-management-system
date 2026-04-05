import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { PersonController } from './person.controller';
import { PersonEntity } from './person.entity';
import { PersonRepository } from './person.repository';
import { PersonStatusHistoryEntity } from '../personStatusHistory/personStatusHistory.entity';
import { PersonStatusHistoryRepository } from '../personStatusHistory/personStatusHistory.repository';
import { PersonService } from './person.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, AdmissionRequestEntity, PersonStatusHistoryEntity])],
  controllers: [PersonController],
  providers: [PersonRepository, PersonStatusHistoryRepository, PersonService],
})
export class PersonModule {}