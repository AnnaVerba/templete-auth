import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser, HttpRequest } from '../../';

export const httpUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUser => {
  const request: HttpRequest = ctx.switchToHttp().getRequest();
  return request.user;
});
