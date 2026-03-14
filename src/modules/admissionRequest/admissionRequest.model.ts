export const ADMISSION_REQUEST_STATUS_VALUES = [
  'PENDING_AI',
  'PENDING_ADMIN',
  'APPROVED',
  'REJECTED',
] as const;

export type AdmissionRequestStatus =
  (typeof ADMISSION_REQUEST_STATUS_VALUES)[number];

export const GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER'] as const;

export type Gender = (typeof GENDER_VALUES)[number];

export interface AdmissionRequest {
  id: number;
  name: string;
  lastName1: string;
  lastName2: string | null;
  email: string;
  desiredUsername: string;
  birthDate: Date;
  gender: Gender;
  photoUrl: string | null;
  declaredHealthLevel: string | null;
  previousExperience: string | null;
  physicalCondition: string | null;
  declaredSkills: string | null;
  campId: number;
  status: AdmissionRequestStatus;
  suggestedOccupationId: number | null;
  finalOccupationId: number | null;
  occupationModified: boolean;
  reviewedBy: number | null;
  reviewDate: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdmissionRequestDTO {
  name: string;
  lastName1: string;
  lastName2?: string | null;
  email: string;
  desiredUsername: string;
  birthDate: Date;
  gender: Gender;
  photoUrl?: string | null;
  declaredHealthLevel?: string | null;
  previousExperience?: string | null;
  physicalCondition?: string | null;
  declaredSkills?: string | null;
  campId: number;
}

export interface UpdateAdmissionRequestDTO {
  name?: string;
  lastName1?: string;
  lastName2?: string | null;
  email?: string;
  desiredUsername?: string;
  birthDate?: Date;
  gender?: Gender;
  photoUrl?: string | null;
  declaredHealthLevel?: string | null;
  previousExperience?: string | null;
  physicalCondition?: string | null;
  declaredSkills?: string | null;
  campId?: number;
  status?: AdmissionRequestStatus;
  suggestedOccupationId?: number | null;
  finalOccupationId?: number | null;
  occupationModified?: boolean;
  reviewedBy?: number | null;
  reviewDate?: Date | null;
  rejectionReason?: string | null;
}