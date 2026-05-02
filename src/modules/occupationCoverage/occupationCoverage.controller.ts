import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard, RolesGuard } from '../../common/guards';
import { OccupationCoverageService } from './occupationCoverage.service';
import type {
  OccupationAtRisk,
  OccupationCoverage,
  ReplacementSuggestion,
} from './occupationCoverage.model';

@ApiTags('occupationCoverage')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('occupation-coverage')
export class OccupationCoverageController {
  constructor(private readonly coverageService: OccupationCoverageService) {}

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
}
