import { Module } from '@nestjs/common';
import { AdmissionRequestController } from './admissionRequest.controller';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';

@Module({
  controllers: [AdmissionRequestController],
  providers: [AdmissionRequestRepository, AdmissionRequestService],
})
export class AdmissionRequestModule {}
