import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'example-reset-token-value-with-at-least-32-characters' })
  @IsString()
  @MinLength(32)
  token!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
