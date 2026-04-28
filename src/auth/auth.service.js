'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var AuthService_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthService = void 0;
const common_1 = require('@nestjs/common');
const jwt_1 = require('@nestjs/jwt');
const users_service_1 = require('../users/users.service');
const mail_service_1 = require('../mail/mail.service');
const bcrypt = __importStar(require('bcrypt'));
const crypto = __importStar(require('crypto'));
let AuthService = (AuthService_1 = class AuthService {
  usersService;
  jwtService;
  mailService;
  logger = new common_1.Logger(AuthService_1.name);
  constructor(usersService, jwtService, mailService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.mailService = mailService;
  }
  async signup(signupDto) {
    const { name, email, password, role, phone, profilePhoto } = signupDto;
    const existing = await this.usersService.findByEmail(email);
    if (existing)
      throw new common_1.BadRequestException('Email already registered');
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(phone ? { phone } : {}),
      ...(profilePhoto ? { profilePhoto } : {}),
      verificationToken,
      verificationTokenExpires,
    });
    try {
      await this.mailService.sendVerificationEmail(
        email,
        name,
        verificationToken,
      );
    } catch (err) {
      this.logger.error(
        `Verification email failed (to=${email}).`,
        err?.stack || String(err),
      );
      const failOpenRaw = (process.env.MAIL_FAIL_OPEN || '').toLowerCase();
      const failOpen =
        failOpenRaw === 'true' || failOpenRaw === '1' || failOpenRaw === 'yes';
      if (failOpen) {
        return {
          message:
            'Account created, but we could not send the verification email. Please try again later.',
          emailSent: false,
        };
      }
      throw new common_1.ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
    return {
      message:
        'Account created! Please check your email to verify your account.',
    };
  }
  async login(loginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new common_1.UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new common_1.UnauthorizedException('Invalid credentials');
    if (!user.isVerified)
      throw new common_1.UnauthorizedException(
        'Please verify your email before logging in',
      );
    if (!user.isActive)
      throw new common_1.UnauthorizedException(
        'Your account has been deactivated',
      );
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
  async verifyAccount(token) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user)
      throw new common_1.BadRequestException(
        'Invalid or expired verification token',
      );
    if (new Date() > user.verificationTokenExpires) {
      throw new common_1.BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }
    await this.usersService.update(user._id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });
    return { message: 'Email verified successfully! You can now log in.' };
  }
  async forgotPassword(forgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user)
      return { message: 'If that email exists, a reset code has been sent.' };
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await this.usersService.update(user._id, {
      passwordResetToken: resetCode,
      passwordResetExpires: resetExpires,
    });
    await this.mailService.sendPasswordResetEmail(email, user.name, resetCode);
    return { message: 'If that email exists, a reset code has been sent.' };
  }
  async resendVerification(resendVerificationDto) {
    const email = resendVerificationDto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);
    if (!user)
      return {
        message: 'If that email exists, a verification email has been sent.',
      };
    if (user.isVerified)
      return { message: 'Account is already verified. Please log in.' };
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.usersService.update(user._id, {
      verificationToken,
      verificationTokenExpires,
    });
    try {
      await this.mailService.sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
      );
    } catch (err) {
      this.logger.error(
        `Resend verification email failed (to=${email}).`,
        err?.stack || String(err),
      );
      const failOpenRaw = (process.env.MAIL_FAIL_OPEN || '').toLowerCase();
      const failOpen =
        failOpenRaw === 'true' || failOpenRaw === '1' || failOpenRaw === 'yes';
      if (failOpen)
        return {
          message: 'If that email exists, a verification email has been sent.',
          emailSent: false,
        };
      throw new common_1.ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
    return {
      message: 'If that email exists, a verification email has been sent.',
    };
  }
  async resetPassword(resetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByResetToken(token);
    if (!user)
      throw new common_1.BadRequestException('Invalid or expired reset token');
    if (new Date() > user.passwordResetExpires) {
      throw new common_1.BadRequestException(
        'Reset token has expired. Please request a new one.',
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersService.update(user._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
    return { message: 'Password reset successfully! You can now log in.' };
  }
  async getProfile(userId) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new common_1.NotFoundException('User not found');
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    delete userObj.passwordResetToken;
    delete userObj.location;
    return userObj;
  }
});
exports.AuthService = AuthService;
exports.AuthService =
  AuthService =
  AuthService_1 =
    __decorate(
      [
        (0, common_1.Injectable)(),
        __metadata('design:paramtypes', [
          users_service_1.UsersService,
          jwt_1.JwtService,
          mail_service_1.MailService,
        ]),
      ],
      AuthService,
    );
//# sourceMappingURL=auth.service.js.map
