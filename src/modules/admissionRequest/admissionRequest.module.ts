import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestController } from './admissionRequest.controller';
import { AdmissionRequestEntity } from './admissionRequest.entity';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';
import { DecisionTreeModule } from '../decisionTree/decisionTree.module';
import { NotificationModule } from '../notification/notification.module';
import { SystemTimeModule } from '../systemTime/systemTime.module';
import { R2StorageService } from '../../services/r2-storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmissionRequestEntity]),
    DecisionTreeModule,
    NotificationModule,
    SystemTimeModule,
  ],
  controllers: [AdmissionRequestController],
  providers: [AdmissionRequestRepository, AdmissionRequestService, R2StorageService],
})
export class AdmissionRequestModule {}
