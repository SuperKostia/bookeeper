import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export interface AuthContext {
  userId: string;
}

/** Injects the authenticated user context set by AuthGuard. */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthContext => {
  const req = ctx.switchToHttp().getRequest<{ user?: AuthContext }>();
  if (!req.user) {
    throw new Error('CurrentUser used on a route without AuthGuard');
  }
  return req.user;
});
