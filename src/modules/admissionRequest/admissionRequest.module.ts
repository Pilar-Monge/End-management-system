import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionRequestController } from './admissionRequest.controller';
import { AdmissionRequestEntity } from './admissionRequest.entity';
import { AdmissionRequestRepository } from './admissionRequest.repository';
import { AdmissionRequestService } from './admissionRequest.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdmissionRequestEntity])],
  controllers: [AdmissionRequestController],
  providers: [AdmissionRequestRepository, AdmissionRequestService],
})
export class AdmissionRequestModule {}
