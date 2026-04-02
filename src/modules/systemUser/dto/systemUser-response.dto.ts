import { ApiProperty } from '@nestjs/swagger';

import {
  SYSTEM_ROLE_VALUES,
  USER_STATUS_VALUES,
  type SystemRole,
  type UserStatus,
} from '../systemUser.model';

export class SystemUserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  personId!: number;

  @ApiProperty()
  requestId!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: USER_STATUS_VALUES })
  status!: UserStatus;

  @ApiProperty({ enum: SYSTEM_ROLE_VALUES })
  role!: SystemRole;

  @ApiProperty()
  campId!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
