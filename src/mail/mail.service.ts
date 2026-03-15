import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;
  private readonly enabled: boolean;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    this.fromEmail = this.configService.get<string>('MAIL_USER') || '';
    const enabledRaw = (this.configService.get<string>('MAIL_ENABLED') ?? 'true').toLowerCase();
    this.enabled = enabledRaw !== 'false' && enabledRaw !== '0' && enabledRaw !== 'no';
    this.apiUrl = this.configService.get<string>('BREVO_API_URL') || 'https://api.brevo.com/v3/smtp/email';

    if (this.enabled && !this.apiKey) {
      this.logger.error('BREVO_API_KEY is missing. Email sending will fail until it is set on the server.');
    }
    if (this.enabled && !this.fromEmail) {
      this.logger.error('MAIL_USER (sender email) is missing. Email sending will fail until it is set on the server.');
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (!this.enabled) {
      this.logger.warn('Email disabled — skipping send');
      return;
    }
    if (!this.apiKey) throw new Error('BREVO_API_KEY is missing');
    if (!this.fromEmail) throw new Error('MAIL_USER (sender email) is missing');

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'Eqply', email: this.fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Brevo API error: ${error}`);
      throw new Error(`Email send failed: ${error}`);
    }

    this.logger.log(`Email sent to ${to}`);
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';
    const verifyUrl = `${frontendUrl}/auth/verify-account?token=${token}`;
    await this.sendEmail(email, 'Verify your Eqply account', `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px;">
        <h1 style="color:#ff2d87;">Welcome to Eqply, ${name}! 👋</h1>
        <p>Thanks for signing up. Please verify your email to get started.</p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#ff2d87;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Verify My Account
        </a>
        <p style="margin-top:24px;font-size:12px;color:#aaa;">Link expires in 24 hours.</p>
      </div>
    `);
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
    await this.sendEmail(email, 'Reset your Eqply password', `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#1a1a2e;color:#fff;border-radius:12px;">
        <h1 style="color:#ff2d87;">Password Reset 🔐</h1>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#ff2d87;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Reset My Password
        </a>
        <p style="margin-top:24px;font-size:12px;color:#aaa;">Link expires in 1 hour.</p>
      </div>
    `);
  }
}
