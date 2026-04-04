import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import type { SystemRole, UserStatus } from '../systemUser.model';

const SystemRoleEnum = {
  VISITOR: 'VISITOR',
  WORKER: 'WORKER',
  RESOURCE_MANAGEMENT: 'RESOURCE_MANAGEMENT',
  TRAVEL_MANAGER: 'TRAVEL_MANAGER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
} as const;

const UserStatusEnum = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  INACTIVE: 'INACTIVE',
} as const;

export class UpdateSystemUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SystemRoleEnum)
  role?: SystemRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatus;
}
