import { ApiProperty } from '@nestjs/swagger';

export class LoginSystemUserDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  campId!: number;
}
