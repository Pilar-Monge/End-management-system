import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Min, MinLength } from 'class-validator';

export class ForgotPasswordDto {
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
}
