import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
