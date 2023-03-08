import { Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  logger: LoggerService;

  constructor() {
    this.logger = new Logger(RequestLoggerMiddleware.name);
  }

  use(req: FastifyRequest & { originalUrl: string }, res: FastifyReply, next): any {
    this.logger.log(`[${req.method}]: ${req.originalUrl}`);
    next();
  }
}
