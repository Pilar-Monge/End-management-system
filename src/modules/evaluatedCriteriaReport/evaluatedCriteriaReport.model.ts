export type EvaluatedCriteriaReport = {
  id: number;
  reportId: number;
  criteriaId: number;
  evaluatedValue: string;
  scoreObtained: string | null;
  observation: string | null;
};

export type CreateEvaluatedCriteriaReportDTO = {
  reportId: number;
  criteriaId: number;
  evaluatedValue: string;
  scoreObtained?: string | number | null;
  observation?: string | null;
};

export type UpdateEvaluatedCriteriaReportDTO = Partial<CreateEvaluatedCriteriaReportDTO>;
