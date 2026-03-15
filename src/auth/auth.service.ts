import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password, role } = signupDto;

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      verificationTokenExpires,
    });

    try {
      await this.mailService.sendVerificationEmail(email, name, verificationToken);
    } catch (err: any) {
      this.logger.error(`Verification email failed (to=${email}).`, err?.stack || String(err));

      const failOpenRaw = (process.env.MAIL_FAIL_OPEN || '').toLowerCase();
      const failOpen = failOpenRaw === 'true' || failOpenRaw === '1' || failOpenRaw === 'yes';
      if (failOpen) {
        return {
          message: 'Account created, but we could not send the verification email. Please try again later.',
          emailSent: false,
        };
      }

      throw new ServiceUnavailableException('Email service is temporarily unavailable. Please try again later.');
    }

    return { message: 'Account created! Please check your email to verify your account.' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) throw new UnauthorizedException('Please verify your email before logging in');
    if (!user.isActive) throw new UnauthorizedException('Your account has been deactivated');

    await this.usersService.update(user._id, { lastLogin: new Date() });

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyAccount(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired verification token');

    if (new Date() > user.verificationTokenExpires) {
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    await this.usersService.update(user._id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    return { message: 'Email verified successfully! You can now log in.' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) return { message: 'If that email exists, a reset link has been sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.update(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    try {
      await this.mailService.sendPasswordResetEmail(email, user.name, resetToken);
    } catch (err: any) {
      // Fail closed would leak availability details and break UX; log and respond generically.
      this.logger.error(`Password reset email failed (to=${email}).`, err?.stack || String(err));
    }

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resendVerification(resendVerificationDto: ResendVerificationDto) {
    const email = resendVerificationDto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);

    // Always respond generically to avoid email enumeration.
    if (!user) return { message: 'If that email exists, a verification email has been sent.' };
    if (user.isVerified) return { message: 'Account is already verified. Please log in.' };

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.usersService.update(user._id, { verificationToken, verificationTokenExpires });

    try {
      await this.mailService.sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (err: any) {
      this.logger.error(`Resend verification email failed (to=${email}).`, err?.stack || String(err));

      const failOpenRaw = (process.env.MAIL_FAIL_OPEN || '').toLowerCase();
      const failOpen = failOpenRaw === 'true' || failOpenRaw === '1' || failOpenRaw === 'yes';
      if (failOpen) return { message: 'If that email exists, a verification email has been sent.', emailSent: false };

      throw new ServiceUnavailableException('Email service is temporarily unavailable. Please try again later.');
    }

    return { message: 'If that email exists, a verification email has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByResetToken(token);

    if (!user) throw new BadRequestException('Invalid or expired reset token');
    if (new Date() > user.passwordResetExpires) {
      throw new BadRequestException('Reset token has expired. Please request a new one.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersService.update(user._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: 'Password reset successfully! You can now log in.' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    delete userObj.passwordResetToken;
    delete userObj.location;
    return userObj;
  }
}
