import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { SessionStatus } from '../session.model';

export class CreateSessionDto {
  @ApiProperty()
  token!: string;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  campId!: number;

  @ApiProperty()
  expirationDate!: Date;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  lastActivityDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  sourceIp?: string | null;

  @ApiPropertyOptional()
  status?: SessionStatus;
}
