import { ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../systemUser.model';

export class UpdateSystemUserDto {
  @ApiPropertyOptional()
  personId?: number;

  @ApiPropertyOptional()
  requestId?: number;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  role?: SystemRole;

  @ApiPropertyOptional()
  campId?: number;
}
