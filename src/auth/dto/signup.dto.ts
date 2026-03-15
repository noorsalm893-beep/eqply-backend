import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional, MaxLength } from 'class-validator';

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
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  role: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  // Avatar selection stored as a string (id or URL).
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhoto?: string;
}
