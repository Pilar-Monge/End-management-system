export enum AdmissionRequestStatus {
  PENDIENTE_IA = 'PENDIENTE_IA',
  PENDIENTE_ADMIN = 'PENDIENTE_ADMIN',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA'
}

export enum Gender {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
  OTRO = 'OTRO'
}

export interface AdmissionRequest {
  id: string;
  nombreCompleto: string;
  correo: string;
  usernameDeseado: string;
  fechaNacimiento: Date;
  genero: Gender;
  fotoUrl?: string | null;
  nivelSaludDeclarado?: string | null;
  experienciasPrevias?: string | null;
  condicionFisica?: string | null;
  habilidadesDeclaradas?: string | null;
  campamentoId: string;
  estado: AdmissionRequestStatus;
  oficioSugeridoId?: string | null;
  revisadoPor?: string | null;
  fechaRevision?: Date | null;
  motivoRechazo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdmissionRequestDTO {
  nombreCompleto: string;
  correo: string;
  usernameDeseado: string;
  fechaNacimiento: Date;
  genero: Gender;
  fotoUrl?: string | null;
  nivelSaludDeclarado?: string | null;
  experienciasPrevias?: string | null;
  condicionFisica?: string | null;
  habilidadesDeclaradas?: string | null;
  campamentoId: string;
}

export interface UpdateAdmissionRequestDTO {
  nombreCompleto?: string;
  correo?: string;
  usernameDeseado?: string;
  fechaNacimiento?: Date;
  genero?: Gender;
  fotoUrl?: string | null;
  nivelSaludDeclarado?: string | null;
  experienciasPrevias?: string | null;
  condicionFisica?: string | null;
  habilidadesDeclaradas?: string | null;
  estado?: AdmissionRequestStatus;
  oficioSugeridoId?: string | null;
  revisadoPor?: string | null;
  fechaRevision?: Date | null;
  motivoRechazo?: string | null;
}

export interface AdmissionRequestResponse {
  id: string;
  nombreCompleto: string;
  correo: string;
  usernameDeseado: string;
  fechaNacimiento: Date;
  genero: Gender;
  fotoUrl: string | null;
  nivelSaludDeclarado: string | null;
  experienciasPrevias: string | null;
  condicionFisica: string | null;
  habilidadesDeclaradas: string | null;
  campamentoId: string;
  estado: AdmissionRequestStatus;
  oficioSugeridoId: string | null;
  revisadoPor: string | null;
  fechaRevision: Date | null;
  motivoRechazo: string | null;
  createdAt: Date;
  updatedAt: Date;
}