import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user_example' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  password!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  campId!: number;
}

export class LoginUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user_example' })
  username!: string;

  @ApiProperty({ example: 'SYSTEM_ADMIN' })
  rol!: string;

  @ApiProperty({ example: 1 })
  campId!: number;
}

export class LoginResponseDataDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNhbXBJZCI6MSwicm9sIjoiU1lTVEVNX0FETUlOIn0.signature',
  })
  token!: string;

  @ApiProperty({ type: LoginUserResponseDto })
  user!: LoginUserResponseDto;
}
