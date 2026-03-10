import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-account?token=${token}`;
    await this.transporter.sendMail({
      from: `"Eqply" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Verify your Eqply account',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px;">
          <h1 style="color:#ff2d87;">Welcome to Eqply, ${name}! 👋</h1>
          <p>Thanks for signing up. Please verify your email to get started.</p>
          <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#ff2d87;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Verify My Account
          </a>
          <p style="margin-top:24px;font-size:12px;color:#aaa;">Link expires in 24 hours.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"Eqply" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Reset your Eqply password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px;">
          <h1 style="color:#ff2d87;">Password Reset 🔐</h1>
          <p>Hi ${name}, we received a request to reset your password.</p>
          <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#ff2d87;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset My Password
          </a>
          <p style="margin-top:24px;font-size:12px;color:#aaa;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }
}