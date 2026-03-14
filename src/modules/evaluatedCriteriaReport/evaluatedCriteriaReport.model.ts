export interface EvaluatedCriteriaReport {
  id: number;
  reportId: number;
  criteriaId: number;
  evaluatedValue: string;
  scoreObtained: string | null;
  observation: string | null;
}

export interface CreateEvaluatedCriteriaReportDTO {
  reportId: number;
  criteriaId: number;
  evaluatedValue: string;
  scoreObtained?: string | null;
  observation?: string | null;
}

export interface UpdateEvaluatedCriteriaReportDTO {
  reportId?: number;
  criteriaId?: number;
  evaluatedValue?: string;
  scoreObtained?: string | null;
  observation?: string | null;
}
