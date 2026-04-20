import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks an endpoint as unauthenticated (skips AuthGuard). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
