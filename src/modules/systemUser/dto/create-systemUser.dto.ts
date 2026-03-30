import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { SystemRole } from '../systemUser.model';

export class CreateSystemUserDto {
  @ApiProperty()
  personId!: number;

  @ApiProperty()
  requestId!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional()
  role?: SystemRole;

  @ApiProperty()
  campId!: number;
}
