export const CAMP_STATUS_VALUES = ['ACTIVE', 'INACTIVE', 'ABANDONED'] as const;

export type CampStatus = (typeof CAMP_STATUS_VALUES)[number];

export interface Camp {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  description: string | null;
  status: CampStatus;
  foundationDate: Date;
  maxPersonCapacity: number;
  sessionInactivityMinutes: number;
  minimumDailyRationPerPerson: string;
  stockAlertThresholdPercentage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampDTO {
  name: string;
  latitude: string;
  longitude: string;
  description?: string | null;
  status?: CampStatus;
  foundationDate: Date;
  maxPersonCapacity?: number;
  sessionInactivityMinutes?: number;
  minimumDailyRationPerPerson?: string;
  stockAlertThresholdPercentage?: string;
}

export interface UpdateCampDTO {
  name?: string;
  latitude?: string;
  longitude?: string;
  description?: string | null;
  status?: CampStatus;
  foundationDate?: Date;
  maxPersonCapacity?: number;
  sessionInactivityMinutes?: number;
  minimumDailyRationPerPerson?: string;
  stockAlertThresholdPercentage?: string;
}
