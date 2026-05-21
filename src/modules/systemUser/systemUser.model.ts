export const SYSTEM_ROLE_VALUES = [
  'WORKER',
  'RESOURCE_MANAGEMENT',
  'TRAVEL_MANAGER',
  'SYSTEM_ADMIN',
] as const;

export const SystemRole = {
  WORKER: 'WORKER',
  RESOURCE_MANAGEMENT: 'RESOURCE_MANAGEMENT',
  TRAVEL_MANAGER: 'TRAVEL_MANAGER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
} as const;

export type SystemRole = (typeof SYSTEM_ROLE_VALUES)[number];

export const USER_STATUS_VALUES = ['ACTIVE', 'BLOCKED', 'INACTIVE'] as const;

export type UserStatus = (typeof USER_STATUS_VALUES)[number];

export interface User {
  id: number;
  personId: number;
  requestId: number;
  username: string;
  passwordHash: string;
  email: string;
  status: UserStatus;
  role: SystemRole;
  campId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = {
  personId: number;
  requestId: number;
  username: string;
  password: string;
  email: string;
  role: SystemRole;
  campId: number;
};

export type CreateUserDBDTO = {
  personId: number;
  requestId: number;
  username: string;
  passwordHash: string;
  email: string;
  role: SystemRole;
  status?: UserStatus;
  campId: number;
};

export type UserResponse = Omit<User, 'passwordHash'>;

export interface LoginDTO {
  username: string;
  password: string;
  campId: number;
}

export type UpdateUserDTO = Partial<Omit<CreateUserDBDTO, 'passwordHash'>> & {
  passwordHash?: string;
};
