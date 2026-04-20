import { z } from 'zod';

export const UserRoleSchema = z.enum(['client', 'keeper', 'both']);
export type UserRole = z.infer<typeof UserRoleSchema>;

/** E.164 phone, validated at the API boundary. */
export const PhoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{6,14}$/, 'Phone must be E.164, e.g. +33612345678');

export const SendOtpSchema = z.object({
  phone: PhoneSchema,
});
export type SendOtpInput = z.infer<typeof SendOtpSchema>;

export const VerifyOtpSchema = z.object({
  phone: PhoneSchema,
  code: z.string().length(6),
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  phone: PhoneSchema,
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  role: UserRoleSchema,
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;
