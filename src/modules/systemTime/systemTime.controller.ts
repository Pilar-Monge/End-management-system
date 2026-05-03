import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { SystemTimeService } from './systemTime.service';

@Controller('system/time')
@ApiTags('System Time')
export class SystemTimeController {
  constructor(private readonly systemTimeService: SystemTimeService) {}
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get server time' })
  @ApiOkResponse({ description: 'Current server time' })
  getServerTime() {
    return this.systemTimeService.getServerTime();
  }
}
