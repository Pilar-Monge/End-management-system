export interface RequestResourceDetail {
  id: number;
  requestId: number;
  resourceTypeId: number;
  requestedAmount: string;
  approvedAmount: string | null;
}

export interface CreateRequestResourceDetailDTO {
  requestId: number;
  resourceTypeId: number;
  requestedAmount: string;
  approvedAmount?: string | null;
}

export interface UpdateRequestResourceDetailDTO {
  requestId?: number;
  resourceTypeId?: number;
  requestedAmount?: string;
  approvedAmount?: string | null;
}
