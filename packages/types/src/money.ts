import { z } from 'zod';

/**
 * All money amounts travel as integer cents (EUR).
 * Format only at the UI edge via formatEuros().
 */
export const CentsSchema = z.number().int().min(0);
export type Cents = z.infer<typeof CentsSchema>;

export const PLATFORM_FEE_RATE = 0.15;
export const CLIENT_FLAT_FEE_CENTS = 150; // 1,50 €

/**
 * Split a booking total into keeper, platform, and stripe-billable amounts.
 * Inputs and outputs are all in cents.
 */
export function splitBookingAmounts(hourlyRateCents: Cents, durationMinutes: number) {
  const baseCents = Math.round((hourlyRateCents * durationMinutes) / 60);
  const platformCommissionCents = Math.round(baseCents * PLATFORM_FEE_RATE);
  const keeperCents = baseCents - platformCommissionCents;
  const clientTotalCents = baseCents + CLIENT_FLAT_FEE_CENTS;
  return {
    baseCents,
    platformCommissionCents,
    keeperCents,
    serviceFeeCents: CLIENT_FLAT_FEE_CENTS,
    clientTotalCents,
  };
}

export function formatEuros(cents: Cents, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
