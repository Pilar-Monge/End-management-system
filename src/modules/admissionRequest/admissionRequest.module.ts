import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestController } from './admissionRequest.controller';
import { AdmissionRequestEntity } from './admissionRequest.entity';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';
import { DecisionTreeModule } from '../decisionTree/decisionTree.module';
import { NotificationModule } from '../notification/notification.module';
import { SystemTimeModule } from '../systemTime/systemTime.module';
import { SupabaseStorageService } from '../../services/supabase-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmissionRequestEntity]),
    DecisionTreeModule,
    NotificationModule,
    SystemTimeModule,
  ],
  controllers: [AdmissionRequestController],
  providers: [AdmissionRequestRepository, AdmissionRequestService, SupabaseStorageService],
})
export class AdmissionRequestModule {}
