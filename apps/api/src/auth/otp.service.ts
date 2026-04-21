import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio, { type Twilio } from 'twilio';

/**
 * Sends and verifies phone OTPs.
 *
 * - If TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_VERIFY_SID are set,
 *   we hit Twilio Verify for real.
 * - Otherwise we run in dev stub mode: a random 6-digit code is generated,
 *   logged to stdout, and stored in memory with a 5-minute TTL. Enough for
 *   local dev without credentials. The mobile app still sees the real flow.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly client: Twilio | null;
  private readonly verifySid: string | null;
  private readonly devStore = new Map<string, { code: string; expiresAt: number }>();
  private readonly TTL_MS = 5 * 60 * 1000;

  constructor(private readonly config: ConfigService) {
    const sid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.config.get<string>('TWILIO_AUTH_TOKEN');
    const verifySid = this.config.get<string>('TWILIO_VERIFY_SID');

    if (sid && token && verifySid) {
      this.client = twilio(sid, token);
      this.verifySid = verifySid;
      this.logger.log('Twilio Verify enabled');
    } else {
      this.client = null;
      this.verifySid = null;
      this.logger.warn('Twilio not configured — running OTP in dev stub mode');
    }
  }

  /**
   * Returns the generated code **only** in dev stub mode. In real Twilio mode
   * returns null — the code is never exposed. The API surfaces `devCode` back
   * to the client only when Twilio is not configured, so the mobile app can
   * display it in a dev banner.
   */
  async send(phone: string): Promise<{ devCode: string | null }> {
    if (this.client && this.verifySid) {
      await this.client.verify.v2
        .services(this.verifySid)
        .verifications.create({ to: phone, channel: 'sms' });
      return { devCode: null };
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.devStore.set(phone, { code, expiresAt: Date.now() + this.TTL_MS });
    this.logger.log(`[DEV OTP] phone=${phone} code=${code}`);
    return { devCode: code };
  }

  async verify(phone: string, code: string): Promise<void> {
    if (this.client && this.verifySid) {
      const check = await this.client.verify.v2
        .services(this.verifySid)
        .verificationChecks.create({ to: phone, code });
      if (check.status !== 'approved') {
        throw new UnauthorizedException('Invalid code');
      }
      return;
    }

    const entry = this.devStore.get(phone);
    if (!entry || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Code expired — request a new one');
    }
    if (entry.code !== code) {
      throw new UnauthorizedException('Invalid code');
    }
    this.devStore.delete(phone);
  }
}
