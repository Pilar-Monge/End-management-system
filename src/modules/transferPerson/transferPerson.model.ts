export const PERSON_TRANSFER_STATUS_VALUES = [
  'CONFIRMED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELED',
] as const;

export type PersonTransferStatus = (typeof PERSON_TRANSFER_STATUS_VALUES)[number];

export interface TransferPerson {
  id: number;
  transferId: number;
  personId: number;
  status: PersonTransferStatus;
  departureDate: Date | null;
  arrivalDate: Date | null;
}

export interface CreateTransferPersonDTO {
  transferId: number;
  personId: number;
  status?: PersonTransferStatus;
  departureDate?: Date | null;
  arrivalDate?: Date | null;
}

export interface UpdateTransferPersonDTO {
  transferId?: number;
  personId?: number;
  status?: PersonTransferStatus;
  departureDate?: Date | null;
  arrivalDate?: Date | null;
}
