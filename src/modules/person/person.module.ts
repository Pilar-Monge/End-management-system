import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestEntity } from '../admissionRequest/admissionRequest.entity';
import { NotificationModule } from '../notification/notification.module';
import { PersonController } from './person.controller';
import { PersonEntity } from './person.entity';
import { PersonRepository } from './person.repository';
import { PersonStatusHistoryEntity } from '../personStatusHistory/personStatusHistory.entity';
import { PersonStatusHistoryRepository } from '../personStatusHistory/personStatusHistory.repository';
import { PersonService } from './person.service';
import { SupabaseStorageService } from '../../services/supabase-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonEntity, AdmissionRequestEntity, PersonStatusHistoryEntity]),
    NotificationModule,
  ],
  controllers: [PersonController],
  providers: [
    PersonRepository,
    PersonStatusHistoryRepository,
    PersonService,
    SupabaseStorageService,
  ],
})
export class PersonModule {}
