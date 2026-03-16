import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 8, example: 'P@ssw0rd!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['student', 'freelancer', 'vendor'], example: 'student' })
  @IsEnum(['student', 'freelancer', 'vendor'])
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  role: string;

  @ApiPropertyOptional({ maxLength: 40, example: '+201234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  // Avatar selection stored as a string (id or URL).
  @ApiPropertyOptional({ maxLength: 500, example: 'https://cdn.example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhoto?: string;
}
