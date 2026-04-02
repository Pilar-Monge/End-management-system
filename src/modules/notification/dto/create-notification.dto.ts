import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../../systemUser/systemUser.model';
import type { NotificationType } from '../notification.model';

export class CreateNotificationDto {
  @ApiProperty()
  campId!:  number;

  @ApiPropertyOptional({ nullable: true })
  userId?: number | null;

  @ApiPropertyOptional({ nullable: true })
  targetRole?: SystemRole | null;

  @ApiProperty()
  type!:  NotificationType;

  @ApiProperty()
  title!:  string;

  @ApiProperty()
  message!:  string;

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