export const EXPEDITION_STATUS_VALUES = [
  'PLANNED',
  'IN_PROGRESS',
  'DELAYED',
  'COMPLETED',
  'LOST',
  'CANCELED',
] as const;

export type ExpeditionStatus = (typeof EXPEDITION_STATUS_VALUES)[number];

export interface Expedition {
  id: number;
  campId: number;
  name: string;
  objective: string | null;
  destinationDescription: string | null;
  destinationLatitude: string | null;
  destinationLongitude: string | null;
  plannedDepartureDate: Date;
  actualDepartureDate: Date | null;
  plannedReturnDate: Date;
  actualReturnDate: Date | null;
  extraDaysAvailable: number;
  extraDaysUsed: number;
  status: ExpeditionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpeditionDTO {
  campId: number;
  name: string;
  objective?: string | null;
  destinationDescription?: string | null;
  destinationLatitude?: string | null;
  destinationLongitude?: string | null;
  plannedDepartureDate?: Date;
  actualDepartureDate?: Date | null;
  plannedReturnDate?: Date;
  actualReturnDate?: Date | null;
  extraDaysAvailable?: number;
  extraDaysUsed?: number;
  status?: ExpeditionStatus;
  fechaSalida?: Date;
  duracionEstimadaDias?: number;
  diasExtrasMaximos?: number;
}

export interface UpdateExpeditionDTO {
  campId?: number;
  name?: string;
  objective?: string | null;
  destinationDescription?: string | null;
  destinationLatitude?: string | null;
  destinationLongitude?: string | null;
  plannedDepartureDate?: Date;
  actualDepartureDate?: Date | null;
  plannedReturnDate?: Date;
  actualReturnDate?: Date | null;
  extraDaysAvailable?: number;
  extraDaysUsed?: number;
  status?: ExpeditionStatus;
  duracionEstimadaDias?: number;
  diasExtrasMaximos?: number;
}
