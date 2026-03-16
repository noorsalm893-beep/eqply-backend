import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ maxLength: 120, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ maxLength: 40, example: '+201234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  // Store an avatar choice (URL or identifier); no file upload.
  @ApiPropertyOptional({ maxLength: 500, example: 'https://cdn.example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhoto?: string;
}
