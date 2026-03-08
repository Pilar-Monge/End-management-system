export type RolSistema = "VISITANTE" | "TRABAJADOR" | "GESTION_RECURSOS" | "ENCARGADO_VIAJES" | "ADMIN_SISTEMA";

export type EstadoUsuario = "ACTIVO" | "BLOQUEADO" | "INACTIVO";

export interface User {
  id: string;
  personaId: string;
  solicitudId: string;
  username: string;
  passwordHash: string;
  correo: string;
  nombreCompleto: string;
  rol: RolSistema;
  estado: EstadoUsuario;
  campamentoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = {
  personaId: string;
  solicitudId: string;
  username: string;
  password: string;
  correo: string;
  nombreCompleto: string;
  rol?: RolSistema;
  campamentoId: string;
};

export type CreateUserDBDTO = {
  personaId: string;
  solicitudId: string;
  username: string;
  passwordHash: string;
  correo: string;
  nombreCompleto: string;
  rol?: RolSistema;
  estado?: EstadoUsuario;
  campamentoId: string;
};

export type UserResponse = Omit<User, 'passwordHash'>;

export interface LoginDTO {
  username: string;
  password: string;
  campamentoId: string;
}

export type UpdateUserDTO = Partial<Omit<CreateUserDBDTO, 'passwordHash'>> & {
  passwordHash?: string;
};