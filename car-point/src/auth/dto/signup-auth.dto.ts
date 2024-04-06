import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupAuthDto {
  @IsNotEmpty()
  @IsString()
  readonly user_name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
