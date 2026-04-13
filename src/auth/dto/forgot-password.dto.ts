import { IsEmail, IsInt, Min } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;

  @IsInt()
  @Min(1)
  campId!: number;
}
