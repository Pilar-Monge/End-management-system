export const AI_DECISION_VALUES = ['ACCEPT', 'REJECT'] as const;

export type AiDecision = (typeof AI_DECISION_VALUES)[number];

export interface AiAdmissionReport {
  id: number;
  requestId: number;
  submittedData: unknown;
  aiResponse: unknown;
  aiDecision: AiDecision;
  aiJustification: string | null;
  suggestedOccupationId: number | null;
  createdAt: Date;
}

export interface CreateAiAdmissionReportDTO {
  requestId: number;
  submittedData: unknown;
  aiResponse: unknown;
  aiDecision: AiDecision;
  aiJustification?: string | null;
  suggestedOccupationId?: number | null;
}

export interface UpdateAiAdmissionReportDTO {
  requestId?: number;
  submittedData?: unknown;
  aiResponse?: unknown;
  aiDecision?: AiDecision;
  aiJustification?: string | null;
  suggestedOccupationId?: number | null;
}
