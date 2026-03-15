import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  // Store an avatar choice (URL or identifier); no file upload.
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhoto?: string;
}
