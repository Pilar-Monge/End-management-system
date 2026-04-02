import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../../systemUser/systemUser.model';

export class CreateUserRoleHistoryDto {
  @ApiProperty()
  userId!:  number;

  @ApiProperty()
  previousRole!:  SystemRole;

  @ApiProperty()
  newRole!:  SystemRole;

  @ApiProperty()
  changedBy!:  number;

  @ApiPropertyOptional({ nullable: true })
  reason?: string | null;

  @ApiPropertyOptional()
  changeDate?: Date;

}