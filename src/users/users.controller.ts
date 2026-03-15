import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.update(user._id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.location !== undefined ? { location: dto.location } : {}),
      ...(dto.profilePhoto !== undefined ? { profilePhoto: dto.profilePhoto } : {}),
    });

    if (!updated) throw new NotFoundException('User not found');

    const obj = updated.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.passwordResetToken;
    return obj;
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
