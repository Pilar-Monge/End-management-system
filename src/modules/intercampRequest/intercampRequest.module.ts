import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntercampRequestController } from './intercampRequest.controller';
import { IntercampRequestEntity } from './intercampRequest.entity';
import { IntercampRequestRepository } from './intercampRequest.repository';
import { IntercampRequestService } from './intercampRequest.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntercampRequestEntity])],
  controllers: [IntercampRequestController],
  providers: [IntercampRequestRepository, IntercampRequestService],
})
export class IntercampRequestModule {}
