import { BadRequestException, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators';
import { OccupationCoverageService } from './occupationCoverage.service';
import type {
  OccupationAtRisk,
  OccupationCoverage,
  ReplacementSuggestion,
} from './occupationCoverage.model';
import type { AutoAssignmentResult } from './occupationCoverage.service';

@ApiTags('occupationCoverage')
@ApiBearerAuth()
@Roles('SYSTEM_ADMIN', 'WORKER', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER', 'VISITOR')
@Controller('occupation-coverage')
export class OccupationCoverageController {
  constructor(private readonly coverageService: OccupationCoverageService) {}

  private getCurrentUser(req: Request): { userId: number } {
    const currentUser = req.user as { userId?: number } | undefined;

    if (typeof currentUser?.userId !== 'number' || currentUser.userId <= 0) {
      throw new BadRequestException('Authenticated user context is invalid');
    }

    return {
      userId: currentUser.userId,
    };
  }

  @Get(':campId/coverage')
  async getCoverageByCamp(@Param('campId') campId: string): Promise<OccupationCoverage[]> {
    return await this.coverageService.getCoverageByCamp(Number(campId));
  }

  @Get(':campId/coverage/:occupationId')
  async getCoverageById(
    @Param('campId') campId: string,
    @Param('occupationId') occupationId: string,
  ): Promise<OccupationCoverage | null> {
    return await this.coverageService.getCoverageById(Number(occupationId), Number(campId));
  }

  @Get(':campId/critical')
  async getCriticalOccupations(@Param('campId') campId: string): Promise<OccupationCoverage[]> {
    return await this.coverageService.getCriticalOccupations(Number(campId));
  }

  @Get(':campId/at-risk')
  async getOccupationsAtRisk(@Param('campId') campId: string): Promise<OccupationAtRisk[]> {
    return await this.coverageService.getOccupationsAtRisk(Number(campId));
  }

  @Get(':campId/suggestions/:occupationId')
  async getSuggestedReplacements(
    @Param('campId') campId: string,
    @Param('occupationId') occupationId: string,
  ): Promise<ReplacementSuggestion[]> {
    return await this.coverageService.getSuggestedReplacements(
      Number(occupationId),
      Number(campId),
    );
  }

  @Post(':campId/auto-assign/:occupationId')
  async autoAssignReplacement(
    @Param('campId') campId: string,
    @Param('occupationId') occupationId: string,
    @Req() req: Request,
  ): Promise<AutoAssignmentResult> {
    try {
      const currentUser = this.getCurrentUser(req);

      const result = await this.coverageService.autoAssignReplacement(
        Number(occupationId),
        Number(campId),
        currentUser.userId,
      );

      return result;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error during auto-assignment',
      );
    }
  }
}
