import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Length, Min, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'testuser' })
  @IsString()
  @MinLength(1)
  username!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  campId!: number;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @Length(8, 8)
  code!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
