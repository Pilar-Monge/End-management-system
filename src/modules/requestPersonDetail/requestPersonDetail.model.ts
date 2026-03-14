export const PERSON_DETAIL_STATUS_VALUES = ['PROPOSED', 'CONFIRMED', 'REJECTED'] as const;
export const PERSON_DETAIL_TYPE_VALUES = ['BY_OCCUPATION', 'SPECIFIC'] as const;

export type PersonDetailStatus = (typeof PERSON_DETAIL_STATUS_VALUES)[number];
export type PersonDetailType = (typeof PERSON_DETAIL_TYPE_VALUES)[number];

export interface RequestPersonDetail {
  id: number;
  requestId: number;
  detailType: PersonDetailType;
  personId: number | null;
  occupationId: number | null;
  amount: number;
  status: PersonDetailStatus;
}

export interface CreateRequestPersonDetailDTO {
  requestId: number;
  detailType?: PersonDetailType;
  personId?: number | null;
  occupationId?: number | null;
  amount?: number;
  status?: PersonDetailStatus;
}

export interface UpdateRequestPersonDetailDTO {
  requestId?: number;
  detailType?: PersonDetailType;
  personId?: number | null;
  occupationId?: number | null;
  amount?: number;
  status?: PersonDetailStatus;
}
