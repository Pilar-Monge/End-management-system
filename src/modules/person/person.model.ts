export const PERSON_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE',
  'SICK',
  'INJURED',
  'OUTSIDE_CAMP',
  'ON_EXPEDITION',
] as const;

export type PersonStatus = (typeof PERSON_STATUS_VALUES)[number];

export const GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;

export type Gender = (typeof GENDER_VALUES)[number];

export interface Person {
  id: number;
  admissionRequestId: number | null;
  name: string;
  lastName1: string;
  lastName2: string | null;
  identificationNumber: string;
  birthDate: Date;
  gender: Gender;
  initialHealthLevel: string | null;
  previousExperience: string | null;
  physicalConditionAtEntry: string | null;
  currentStatus: PersonStatus;
  imageUrl: string | null;
  campId: number;
  occupationId: number | null;
  character: number;
  entryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonDTO {
  admissionRequestId?: number | null;
  name: string;
  lastName1: string;
  lastName2?: string | null;
  identificationNumber: string;
  birthDate: Date | string;
  gender: Gender;
  initialHealthLevel?: string | null;
  previousExperience?: string | null;
  physicalConditionAtEntry?: string | null;
  imageUrl?: string | null;
  campId: number;
  character: number;
  occupationId?: number | null;
}

export interface UpdatePersonDTO {
  admissionRequestId?: number | null;
  name?: string;
  lastName1?: string;
  lastName2?: string | null;
  identificationNumber?: string;
  birthDate?: Date | string;
  gender?: Gender;
  initialHealthLevel?: string | null;
  previousExperience?: string | null;
  physicalConditionAtEntry?: string | null;
  currentStatus?: PersonStatus;
  imageUrl?: string | null;
  campId?: number;
  occupationId?: number | null;
  character?: number;
}
