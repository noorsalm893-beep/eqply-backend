import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ minLength: 8, example: 'N3wP@ssw0rd!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
