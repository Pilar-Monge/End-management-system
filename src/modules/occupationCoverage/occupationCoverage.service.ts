import { Injectable, BadRequestException } from '@nestjs/common';

import { OccupationCoverageRepository } from './occupationCoverage.repository';
import type {
  OccupationAtRisk,
  OccupationCoverage,
  ReplacementSuggestion,
} from './occupationCoverage.model';

export interface AutoAssignmentResult {
  success: boolean;
  message: string;
  assignedPerson?: {
    id: number;
    name: string;
    fromOccupation: string;
    toOccupation: string;
  };
}

@Injectable()
export class OccupationCoverageService {
  constructor(private readonly repository: OccupationCoverageRepository) {}

  setTemporaryAssignmentService(service: any): void {
    this.temporaryAssignmentService = service;
  }

  private temporaryAssignmentService: any;

  async getCoverageByCamp(campId: number): Promise<OccupationCoverage[]> {
    return await this.repository.getOccupationCoverageByCamp(campId);
  }

  async getCoverageById(occupationId: number, campId: number): Promise<OccupationCoverage | null> {
    return await this.repository.getOccupationCoverageById(occupationId, campId);
  }

  async getCriticalOccupations(campId: number): Promise<OccupationCoverage[]> {
    return await this.repository.getCriticalOccupationsByCamp(campId);
  }

  async getOccupationsAtRisk(campId: number): Promise<OccupationAtRisk[]> {
    const coverages = await this.getCriticalOccupations(campId);
    const atRiskOccupations = coverages.filter((coverage) => coverage.isAtRisk);

    const result: OccupationAtRisk[] = [];
    for (const coverage of atRiskOccupations) {
      result.push({
        occupationId: coverage.occupationId,
        occupationName: coverage.occupationName,
        campId: coverage.campId,
        availableWorkers: coverage.availableWorkers,
        minimumRequired: coverage.minimumRequiredWorkers,
        coveragePercent: coverage.coveragePercent,
        suggestedReplacements: await this.getSuggestedReplacements(coverage.occupationId, campId),
      });
    }

    return result;
  }

  async getSuggestedReplacements(
    occupationId: number,
    campId: number,
  ): Promise<ReplacementSuggestion[]> {
    const coverage = await this.getCoverageById(occupationId, campId);

    if (!coverage || !coverage.isAtRisk) {
      return [];
    }

    const allCoverages = await this.getCoverageByCamp(campId);
    const replacementSuggestions: ReplacementSuggestion[] = [];
    let remainingDeficit = coverage.deficit;

    for (const sourceCoverage of allCoverages) {
      if (sourceCoverage.occupationId === occupationId || sourceCoverage.surplus <= 0) {
        continue;
      }

      const availablePersons = await this.repository.getAvailablePersonsForReplacement(
        sourceCoverage.occupationId,
        occupationId,
        campId,
      );

      const transferableWorkers = Math.min(
        sourceCoverage.surplus,
        remainingDeficit,
        availablePersons.length,
      );

      for (let index = 0; index < transferableWorkers; index += 1) {
        const person = availablePersons[index];
        if (!person) {
          continue;
        }

        replacementSuggestions.push({
          personId: person.id,
          personName: `${person.name} ${person.lastName1}`.trim(),
          currentOccupationId: sourceCoverage.occupationId,
          currentOccupationName: sourceCoverage.occupationName,
          targetOccupationId: occupationId,
          targetOccupationName: coverage.occupationName,
          reason: `Source occupation '${sourceCoverage.occupationName}' has surplus workers and '${coverage.occupationName}' is below minimum coverage.`,
          priority: remainingDeficit > 3 ? 'HIGH' : remainingDeficit > 1 ? 'MEDIUM' : 'LOW',
        });
      }

      remainingDeficit -= transferableWorkers;

      if (remainingDeficit <= 0) {
        break;
      }
    }

    return replacementSuggestions;
  }

  async autoAssignReplacement(
    occupationId: number,
    campId: number,
    assignedByUserId: number,
  ): Promise<AutoAssignmentResult> {
    if (!this.temporaryAssignmentService) {
      throw new BadRequestException('Temporary assignment service not initialized');
    }

    const coverage = await this.getCoverageById(occupationId, campId);
    if (!coverage || !coverage.isAtRisk) {
      return {
        success: false,
        message: 'Occupation is not at risk or does not require auto-assignment',
      };
    }

    const suggestions = await this.getSuggestedReplacements(occupationId, campId);
    if (suggestions.length === 0) {
      return {
        success: false,
        message: `No available workers found to reassign to '${coverage.occupationName}'`,
      };
    }

    const topSuggestion = suggestions[0];
    if (!topSuggestion) {
      return {
        success: false,
        message: 'No suitable replacement found',
      };
    }

    try {
      const assignment = await this.temporaryAssignmentService.createAssignment({
        personId: topSuggestion.personId,
        temporaryOccupationId: occupationId,
        assignedBy: assignedByUserId,
        reason: `Auto-assigned to cover critical shortage in ${coverage.occupationName}`,
      });

      return {
        success: true,
        message: `Successfully auto-assigned ${topSuggestion.personName} to ${coverage.occupationName}`,
        assignedPerson: {
          id: topSuggestion.personId,
          name: topSuggestion.personName,
          fromOccupation: topSuggestion.currentOccupationName,
          toOccupation: topSuggestion.targetOccupationName,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to auto-assign: ${errorMessage}`,
      };
    }
  }
}
