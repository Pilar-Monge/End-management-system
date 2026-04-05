export const OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES = [
  'AGE',
  'HEALTH',
  'SKILLS',
  'BEHAVIOR',
  'OTHER',
] as const;

export type OccupationCriteriaEvaluatedField =
  (typeof OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES)[number];

export type OccupationAssignmentCriteria = {
  id: number;
  occupationId: number;
  criteriaDescription: string;
  evaluatedField: OccupationCriteriaEvaluatedField;
  weight: string;
  active: boolean;
  createdAt: Date;
};

export type CreateOccupationAssignmentCriteriaDTO = {
  occupationId: number;
  criteriaDescription: string;
  evaluatedField: OccupationCriteriaEvaluatedField;
  weight?: string | number;
  active?: boolean;
};

export type UpdateOccupationAssignmentCriteriaDTO = Partial<CreateOccupationAssignmentCriteriaDTO>;
