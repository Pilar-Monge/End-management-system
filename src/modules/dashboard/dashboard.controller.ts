import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { Roles } from '../../common/decorators';
import { SystemRole } from '../systemUser/systemUser.model';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  private getCampIdFromRequest(req: Request): number {
    const currentUser = req.user as { campId?: number } | undefined;
    if (typeof currentUser?.campId !== 'number' || currentUser.campId <= 0) {
      throw new BadRequestException('Authenticated user does not have a valid campId');
    }

    return currentUser.campId;
  }

  @Get('general')
  @Roles(SystemRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'View general camp dashboard' })
  async getGeneralDashboard(@Req() req: Request) {
    const campId = this.getCampIdFromRequest(req);
    return {
      success: true,
      data: {
        generalStats: await this.service.getGeneralStats(campId),
      },
    };
  }

  @Get('inventory')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.RESOURCE_MANAGEMENT)
  @ApiOperation({ summary: 'View inventory dashboard' })
  async getInventoryDashboard(@Req() req: Request) {
    const campId = this.getCampIdFromRequest(req);
    const [inventoryData, consumptionTrend] = await Promise.all([
      this.service.getInventoryData(campId),
      this.service.getConsumptionTrend(campId),
    ]);

    return {
      success: true,
      data: {
        inventoryData,
        consumptionTrend,
      },
    };
  }

  @Get('expeditions')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.TRAVEL_MANAGER)
  @ApiOperation({ summary: 'View expeditions dashboard' })
  async getExpeditionsDashboard(@Req() req: Request) {
    const campId = this.getCampIdFromRequest(req);
    return {
      success: true,
      data: {
        expeditionStatus: await this.service.getExpeditionStatus(campId),
      },
    };
  }

  @Get('personal')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.WORKER,
    SystemRole.RESOURCE_MANAGEMENT,
    SystemRole.TRAVEL_MANAGER,
    SystemRole.VISITOR,
  )
  @ApiOperation({ summary: 'View personal panel for assigned resources' })
  async getPersonalPanel(@Req() req: Request) {
    const currentUser = req.user as { userId?: number; campId?: number } | undefined;
    const userId = typeof currentUser?.userId === 'number' ? currentUser.userId : null;
    const campId = this.getCampIdFromRequest(req);
    return { success: true, data: await this.service.getPersonalPanel(campId, userId) };
  }
}
