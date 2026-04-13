import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestController } from './admissionRequest.controller';
import { AdmissionRequestEntity } from './admissionRequest.entity';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';
import { DecisionTreeModule } from '../decisionTree/decisionTree.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdmissionRequestEntity]), DecisionTreeModule, NotificationModule],
  controllers: [AdmissionRequestController],
  providers: [AdmissionRequestRepository, AdmissionRequestService],
})
export class AdmissionRequestModule {}
