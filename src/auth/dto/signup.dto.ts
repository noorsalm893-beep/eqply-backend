import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['student', 'freelancer', 'vendor'])
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  location: string;
}