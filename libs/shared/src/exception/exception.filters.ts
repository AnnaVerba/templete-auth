import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger, LoggerFacade } from '../logger';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerFacade) private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error('HttpException!', 'error', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
