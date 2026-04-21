import type { User } from '@bookeeper/types';
import { api } from './client';

export interface VerifyOtpResponse {
  token: string;
  user: User;
}

export interface SendOtpResponse {
  /** Non-null only when the server runs in dev stub mode (no Twilio). */
  devCode: string | null;
}

export function sendOtp(phone: string): Promise<SendOtpResponse> {
  return api('/auth/send-otp', { method: 'POST', body: { phone }, auth: false });
}

export function verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
  return api('/auth/verify-otp', { method: 'POST', body: { phone, code }, auth: false });
}

export function me(): Promise<User> {
  return api('/auth/me');
}
