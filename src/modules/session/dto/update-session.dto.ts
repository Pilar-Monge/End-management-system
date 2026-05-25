import { ApiPropertyOptional } from '@nestjs/swagger';

import type { SessionStatus } from '../session.model';

export class UpdateSessionDto {
  @ApiPropertyOptional()
  token?: string;

  @ApiPropertyOptional()
  userId?: number;

  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  lastActivityDate?: Date;

  @ApiPropertyOptional()
  expirationDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  sourceIp?: string | null;

  @ApiPropertyOptional()
  status?: SessionStatus;
}
