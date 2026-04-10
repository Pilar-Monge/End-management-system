import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators';
import { SystemTimeService } from './systemTime.service';

@Controller('system/time')
export class SystemTimeController {
  constructor(private readonly systemTimeService: SystemTimeService) {}
  @Public()
  @Get()
  getServerTime() {
    return this.systemTimeService.getServerTime();
  }
}
