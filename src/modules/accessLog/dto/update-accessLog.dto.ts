import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { AccessLogEventType } from '../accessLog.model';

export class UpdateAccessLogDto {
  @ApiPropertyOptional({ nullable: true })
  sessionId?: number | null;

  @ApiPropertyOptional()
  userId?: number;

  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional()
  eventDate?: Date;

  @ApiPropertyOptional()
  eventType?: AccessLogEventType;

  @ApiPropertyOptional({ nullable: true })
  sourceIp?: string | null;

  @ApiPropertyOptional({ nullable: true })
  detail?: string | null;

}