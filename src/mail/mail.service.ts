import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dns from 'dns';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;
  private readonly mailEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
    const enabled = (this.configService.get<string>('MAIL_ENABLED') ?? 'true').toLowerCase();
    this.mailEnabled = enabled !== 'false' && enabled !== '0' && enabled !== 'no';

    if (!this.mailEnabled) {
      this.logger.warn('Email sending is disabled via MAIL_ENABLED=false.');
      return;
    }

    const user = this.configService.get<string>('MAIL_USER');
    const passRaw = this.configService.get<string>('MAIL_PASS');
    const pass = (passRaw ?? '').replace(/\s+/g, '');

    if (!user || !pass) {
      // Throwing here makes Render logs immediately point to env misconfig.
      throw new Error('Missing MAIL_USER/MAIL_PASS env vars (required for email sending).');
    }

    const host = this.configService.get<string>('MAIL_HOST') || 'smtp.gmail.com';
    // Default to 587 (STARTTLS) which tends to work more reliably on many hosts.
    const port = Number(this.configService.get<string>('MAIL_PORT') || 587);
    const secureEnv = (this.configService.get<string>('MAIL_SECURE') ?? '').toLowerCase();
    const secure = secureEnv ? secureEnv === 'true' || secureEnv === '1' : port === 465;

    const forceIpv4EnvRaw = (this.configService.get<string>('MAIL_FORCE_IPV4') ?? '').toLowerCase();
    const forceIpv4EnvSet = forceIpv4EnvRaw.length > 0;
    const forceIpv4 =
      (forceIpv4EnvSet && (forceIpv4EnvRaw === 'true' || forceIpv4EnvRaw === '1' || forceIpv4EnvRaw === 'yes')) ||
      (!forceIpv4EnvSet && nodeEnv === 'production');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: Number(this.configService.get<string>('MAIL_CONNECTION_TIMEOUT_MS') || 15000),
      greetingTimeout: Number(this.configService.get<string>('MAIL_GREETING_TIMEOUT_MS') || 15000),
      socketTimeout: Number(this.configService.get<string>('MAIL_SOCKET_TIMEOUT_MS') || 20000),
      // Many hosting providers don't have outbound IPv6; prefer IPv4 to avoid ENETUNREACH to smtp.gmail.com.
      ...(forceIpv4
        ? {
            lookup: (hostname: string, options: any, callback: any) => {
              const merged = typeof options === 'object' && options ? { ...options, family: 4 } : { family: 4 };
              return dns.lookup(hostname, merged, callback);
            },
          }
        : {}),
    });

    // Surface connectivity/auth problems early in logs.
    this.transporter
      .verify()
      .then(() =>
        this.logger.log(
          `Mail transport ready (${host}:${port}, secure=${secure}, forceIpv4=${forceIpv4 ? 'true' : 'false'}).`,
        ),
      )
      .catch((err) => this.logger.error(`Mail transport verify failed (${host}:${port}).`, err?.stack || String(err)));
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    if (!this.mailEnabled) return;
    if (!this.transporter) throw new Error('Mail transporter not initialized.');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';
    if ((process.env.NODE_ENV || '').toLowerCase() === 'production' && /localhost|127\.0\.0\.1/.test(frontendUrl)) {
      this.logger.warn(`FRONTEND_URL looks local in production: ${frontendUrl}`);
    }
    const fromUser = this.configService.get<string>('MAIL_USER') || '';
    const verifyUrl = `${frontendUrl}/auth/verify-account?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Eqply" <${fromUser}>`,
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
    } catch (err: any) {
      this.logger.error(`sendVerificationEmail failed (to=${email}).`, err?.stack || String(err));
      throw err;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    if (!this.mailEnabled) return;
    if (!this.transporter) throw new Error('Mail transporter not initialized.');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';
    if ((process.env.NODE_ENV || '').toLowerCase() === 'production' && /localhost|127\.0\.0\.1/.test(frontendUrl)) {
      this.logger.warn(`FRONTEND_URL looks local in production: ${frontendUrl}`);
    }
    const fromUser = this.configService.get<string>('MAIL_USER') || '';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Eqply" <${fromUser}>`,
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
    } catch (err: any) {
      this.logger.error(`sendPasswordResetEmail failed (to=${email}).`, err?.stack || String(err));
      throw err;
    }
  }
}
