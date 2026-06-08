export const TRANSFER_STATUS_VALUES = [
  'PENDING_DEPARTURE',
  'IN_TRANSIT',
  'COMPLETED',
  'CANCELED',
] as const;

export type TransferStatus = (typeof TRANSFER_STATUS_VALUES)[number];

export interface Transfer {
  id: number;
  requestId: number;
  plannedDepartureDate: Date;
  actualDepartureDate: Date | null;
  plannedArrivalDate: Date;
  actualArrivalDate: Date | null;
  status: TransferStatus;
  departureApprovedBy: number | null;
  arrivalApprovedBy: number | null;
  rationsForTrip: string;
  receptionNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransferDTO {
  requestId: number;
  plannedDepartureDate: Date;
  actualDepartureDate?: Date | null;
  plannedArrivalDate: Date;
  actualArrivalDate?: Date | null;
  status?: TransferStatus;
  departureApprovedBy?: number | null;
  arrivalApprovedBy?: number | null;
  rationsForTrip?: string;
  receptionNotes?: string | null;
}

export interface UpdateTransferDTO {
  requestId?: number;
  plannedDepartureDate?: Date;
  actualDepartureDate?: Date | null;
  plannedArrivalDate?: Date;
  actualArrivalDate?: Date | null;
  status?: TransferStatus;
  departureApprovedBy?: number | null;
  arrivalApprovedBy?: number | null;
  rationsForTrip?: string;
  receptionNotes?: string | null;
}

export interface UpdateTransferTransportStaffDTO {
  transportPersonIds: number[];
}
