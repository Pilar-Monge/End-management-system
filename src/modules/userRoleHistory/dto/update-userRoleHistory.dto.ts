import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../../systemUser/systemUser.model';

export class UpdateUserRoleHistoryDto {
  @ApiPropertyOptional()
  userId?: number;

  @ApiPropertyOptional()
  previousRole?: SystemRole;

  @ApiPropertyOptional()
  newRole?: SystemRole;

  @ApiPropertyOptional()
  changedBy?: number;

  @ApiPropertyOptional()
  changeDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  reason?: string | null;
}
