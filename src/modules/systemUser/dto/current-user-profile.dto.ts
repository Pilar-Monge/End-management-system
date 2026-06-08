import { ApiProperty } from '@nestjs/swagger';

import {
  SYSTEM_ROLE_VALUES,
  USER_STATUS_VALUES,
  type SystemRole,
  type UserStatus,
} from '../systemUser.model';

export class CurrentUserProfileDto {
  @ApiProperty()
  id!: number;

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
}