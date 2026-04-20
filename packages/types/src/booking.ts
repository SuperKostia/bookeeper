import { z } from 'zod';

export const BookingContextSchema = z.enum(['loisir', 'competition', 'training', 'tournament']);
export type BookingContext = z.infer<typeof BookingContextSchema>;

export const BookingStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'expired',
  'cancelled_client',
  'cancelled_keeper',
  'completed',
  'disputed',
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const LevelSchema = z.enum([
  'loisir',
  'departemental',
  'regional',
  'national',
  'honneur',
]);
export type Level = z.infer<typeof LevelSchema>;

export const LatLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const SearchKeepersSchema = z.object({
  point: LatLngSchema,
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().min(30).max(240),
  context: BookingContextSchema,
  level: LevelSchema.optional(),
  radiusKm: z.number().int().min(1).max(30).default(15),
});
export type SearchKeepersInput = z.infer<typeof SearchKeepersSchema>;

export const CreateBookingSchema = z.object({
  keeperId: z.string().uuid(),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().min(30).max(240),
  context: BookingContextSchema,
  level: LevelSchema,
  location: z.object({
    point: LatLngSchema,
    text: z.string().min(1).max(200),
  }),
  message: z.string().max(280).optional(),
});
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
