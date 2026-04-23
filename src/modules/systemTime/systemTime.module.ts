import { Module } from '@nestjs/common';
import { SystemTimeController } from './systemTime.controller';
import { SystemTimeService } from './systemTime.service';

@Module({
  controllers: [SystemTimeController],
  providers: [SystemTimeService],
  exports: [SystemTimeService],
})
export class SystemTimeModule {}
