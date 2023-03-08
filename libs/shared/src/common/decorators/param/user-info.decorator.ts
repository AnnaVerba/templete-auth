import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequest } from '@app/shared';

export const httpUserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req: HttpRequest = ctx.switchToHttp().getRequest();
  return { ipAddress: req.ip, userAgent: req.headers['user-agent'] };
});
