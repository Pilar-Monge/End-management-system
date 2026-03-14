export const PARTICIPANT_STATUS_VALUES = ['ACTIVE', 'WITHDRAWN'] as const;

export type ParticipantStatus = (typeof PARTICIPANT_STATUS_VALUES)[number];

export interface ExpeditionParticipant {
  id: number;
  expeditionId: number;
  personId: number;
  expeditionRole: string | null;
  status: ParticipantStatus;
  assignmentDate: Date;
}

export interface CreateExpeditionParticipantDTO {
  expeditionId: number;
  personId: number;
  expeditionRole?: string | null;
  status?: ParticipantStatus;
  assignmentDate?: Date;
}

export interface UpdateExpeditionParticipantDTO {
  expeditionId?: number;
  personId?: number;
  expeditionRole?: string | null;
  status?: ParticipantStatus;
  assignmentDate?: Date;
}
