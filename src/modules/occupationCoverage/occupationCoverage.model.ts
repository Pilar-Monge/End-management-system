export interface OccupationCoverage {
  occupationId: number;
  occupationName: string;
  minimumRequiredWorkers: number;
  preferredWorkers: number | null;
  criticalThresholdPercent: string;
  availableWorkers: number;
  activeWorkers: number;
  coveragePercent: number;
  isCritical: boolean;
  isAtRisk: boolean;
  deficit: number;
  surplus: number;
  campId: number;
}

export interface ReplacementSuggestion {
  personId: number;
  personName: string;
  currentOccupationId: number;
  currentOccupationName: string;
  targetOccupationId: number;
  targetOccupationName: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface OccupationAtRisk {
  occupationId: number;
  occupationName: string;
  campId: number;
  availableWorkers: number;
  minimumRequired: number;
  coveragePercent: number;
  suggestedReplacements: ReplacementSuggestion[];
}
