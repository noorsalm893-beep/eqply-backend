import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

function inferImageExt(mimeType: string): string {
  switch ((mimeType || '').toLowerCase()) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    default:
      return '';
  }
}

@Controller('users')
export class UsersController {
  private readonly uploadsRoot = join(process.cwd(), 'uploads');
  private readonly profilePhotosDir = join(this.uploadsRoot, 'profile-photos');

  constructor(private readonly usersService: UsersService) {
    if (!existsSync(this.profilePhotosDir)) mkdirSync(this.profilePhotosDir, { recursive: true });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.update(user._id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.location !== undefined ? { location: dto.location } : {}),
    });

    if (!updated) throw new NotFoundException('User not found');

    const obj = updated.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.passwordResetToken;
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'profile-photos');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req: any, file, cb) => {
          const userId = req.user?._id?.toString() || 'user';
          const safeBase = `${userId}-${Date.now()}`;
          const ext = inferImageExt(file.mimetype) || extname(file.originalname) || '';
          cb(null, `${safeBase}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype?.startsWith('image/')) {
          return cb(new BadRequestException('Only image uploads are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePhoto(@CurrentUser() user: any, @UploadedFile() file?: any) {
    if (!file) throw new BadRequestException('Missing photo file (field name: photo)');

    const photoPath = `/uploads/profile-photos/${file.filename}`;
    const updated = await this.usersService.update(user._id, { profilePhoto: photoPath });
    if (!updated) throw new NotFoundException('User not found');

    return { profilePhoto: photoPath };
  }

  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid user id');

    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id,
      name: user.name,
      role: user.role,
      location: user.location,
      profilePhoto: user.profilePhoto,
    };
  }
}
