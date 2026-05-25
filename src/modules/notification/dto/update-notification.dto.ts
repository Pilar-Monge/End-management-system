import { ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../../systemUser/systemUser.model';
import type { NotificationType } from '../notification.model';

export class UpdateNotificationDto {
  @ApiPropertyOptional()
  campId?: number;

  @ApiPropertyOptional({ nullable: true })
  userId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  targetRole?: SystemRole | null;

  @ApiPropertyOptional()
  type?: NotificationType;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  read?: boolean;

  @ApiPropertyOptional()
  createdDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  readDate?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  sourceType?: string | null;

  @ApiPropertyOptional({ nullable: true })
  sourceId?: number | null;
}
