import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const host = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const host = request.headers.host;
  const isLocal = host.includes('localhost');
  return `http${isLocal ? '' : 's'}://${host}`;
});
