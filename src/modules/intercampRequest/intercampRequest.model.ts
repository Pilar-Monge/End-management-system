export const INTERCAMP_REQUEST_STATUS_VALUES = [
  'DRAFT',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELED',
] as const;

export type IntercampRequestStatus = (typeof INTERCAMP_REQUEST_STATUS_VALUES)[number];

export interface IntercampPersonRequirement {
  occupationId: number;
  quantity: number;
}

export interface IntercampRequest {
  id: number;
  originCampId: number;
  destinationCampId: number;
  status: IntercampRequestStatus;
  description: string | null;
  plannedDepartureDate: Date | null;
  plannedArrivalDate: Date | null;
  personRequirements: IntercampPersonRequirement[];
  createdDate: Date;
  responseDate: Date | null;
  createdBy: number;
  respondedBy: number | null;
}

export interface CreateIntercampRequestDTO {
  originCampId: number;
  destinationCampId: number;
  status?: IntercampRequestStatus;
  description?: string | null;
  plannedDepartureDate?: Date | null;
  plannedArrivalDate?: Date | null;
  createdDate?: Date;
  responseDate?: Date | null;
  createdBy: number;
  respondedBy?: number | null;
}

export interface UpdateIntercampRequestDTO {
  originCampId?: number;
  destinationCampId?: number;
  status?: IntercampRequestStatus;
  description?: string | null;
  plannedDepartureDate?: Date | null;
  plannedArrivalDate?: Date | null;
  createdDate?: Date;
  responseDate?: Date | null;
  createdBy?: number;
  respondedBy?: number | null;
  transportPersonIds?: number[];
}
