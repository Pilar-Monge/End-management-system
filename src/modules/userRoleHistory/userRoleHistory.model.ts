import type { SystemRole } from '../systemUser/systemUser.model';

export interface UserRoleHistory {
  id: number;
  userId: number;
  previousRole: SystemRole;
  newRole: SystemRole;
  changedBy: number;
  changeDate: Date;
  reason: string | null;
}

export interface CreateUserRoleHistoryDTO {
  userId: number;
  previousRole: SystemRole;
  newRole: SystemRole;
  changedBy: number;
  reason?: string | null;
  changeDate?: Date;
}

export interface UpdateUserRoleHistoryDTO {
  userId?: number;
  previousRole?: SystemRole;
  newRole?: SystemRole;
  changedBy?: number;
  changeDate?: Date;
  reason?: string | null;
}
