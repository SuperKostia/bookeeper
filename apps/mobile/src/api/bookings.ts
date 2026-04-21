import type { CreateBookingInput } from '@bookeeper/types';
import { api } from './client';

export interface Booking {
  id: string;
  startsAt: string;
  durationMinutes: number;
  locationText: string;
  context: string;
  level: string;
  hourlyRateCents: number;
  serviceFeeCents: number;
  totalCents: number;
  status: string;
  createdAt: string;
  keeper: {
    id: string;
    firstName: string | null;
    keeperProfile: {
      displayName: string;
      photoUrl: string | null;
      hourlyRateCents: number;
    } | null;
  };
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return api<Booking>('/bookings', { method: 'POST', body: input });
}

export function listMyBookings(): Promise<Booking[]> {
  return api<Booking[]>('/bookings/mine');
}
