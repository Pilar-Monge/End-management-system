import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { AccessLogEventType } from '../accessLog.model';

export class CreateAccessLogDto {
  @ApiPropertyOptional({ nullable: true })
  sessionId?: number | null;

  @ApiProperty()
  userId!:  number;

  @ApiProperty()
  campId!:  number;

  @ApiProperty()
  eventType!:  AccessLogEventType;

  @ApiPropertyOptional()
  eventDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  sourceIp?: string | null;

  @ApiPropertyOptional({ nullable: true })
  detail?: string | null;

}