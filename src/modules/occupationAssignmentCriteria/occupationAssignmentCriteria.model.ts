export const OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES = [
  'physical_condition',
  'previous_experience',
  'declared_health_level',
  'declared_skills',
  'gender',
  'birth_date',
] as const;

export type OccupationCriteriaEvaluatedField =
  (typeof OCCUPATION_CRITERIA_EVALUATED_FIELD_VALUES)[number];

export interface OccupationAssignmentCriteria {
  id: number;
  occupationId: number;
  criteriaDescription: string;
  evaluatedField: OccupationCriteriaEvaluatedField;
  weight: string;
  active: boolean;
  createdAt: Date;
}

export interface CreateOccupationAssignmentCriteriaDTO {
  occupationId: number;
  criteriaDescription: string;
  evaluatedField: OccupationCriteriaEvaluatedField;
  weight?: string;
  active?: boolean;
}

export interface UpdateOccupationAssignmentCriteriaDTO {
  occupationId?: number;
  criteriaDescription?: string;
  evaluatedField?: OccupationCriteriaEvaluatedField;
  weight?: string;
  active?: boolean;
}
