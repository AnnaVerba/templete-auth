import { ArgumentsHost, Catch, ExceptionFilter, Logger, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CoreApiResponse, Code } from '../';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  private logger: LoggerService;

  constructor() {
    this.logger = new Logger(NestHttpExceptionFilter.name);
  }

  public catch(error: any, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse<Response>();
    console.trace();
    let errorResponse: CoreApiResponse<unknown> = CoreApiResponse.error(
      Number.parseInt(error.code) || Code.INTERNAL_ERROR.code,
      error.message,
    );

    errorResponse = this.handleException(error, errorResponse);
    response.status(errorResponse.code).send(errorResponse);
  }

  private handleException(error: any, errorResponse: CoreApiResponse<unknown>): CoreApiResponse<unknown> {
    this.logger.error(JSON.stringify(error));

    if (error.codePrefix) {
      error.code = Code.INTERNAL_ERROR.code;
    }

    if (error.name === 'UnauthorizedException') {
      return CoreApiResponse.error(Code.ACCESS_DENIED_ERROR.code, error.message, null);
    }

    if (error.message === 'NotFound') {
      return CoreApiResponse.error(Code.NOT_FOUND_ERROR.code, error.message, null);
    }

    if (error.message === 'AlreadyExists') {
      return CoreApiResponse.error(Code.CONFLICT_ERROR.code, error.message, null);
    }

    if (error.message === 'Validation error' && error.name === 'SequelizeUniqueConstraintError') {
      return CoreApiResponse.error(Code.CONFLICT_ERROR.code, error.message, null);
    }

    if (error.name === 'NotAuthorizedException') {
      return CoreApiResponse.error(Code.UNAUTHORIZED_ERROR.code, error.message, null);
    }

    if (error.name === 'BadRequestException') {
      return CoreApiResponse.error(Code.BAD_REQUEST_ERROR.code, error.message, null);
    }

    if (error instanceof TokenExpiredError || error.name === 'TokenExpiredError') {
      return CoreApiResponse.error(Code.UNAUTHORIZED_ERROR.code, 'JWTExpired', null);
    }

    if (error instanceof JsonWebTokenError || error.name === 'JsonWebTokenError') {
      return CoreApiResponse.error(Code.BAD_REQUEST_ERROR.code, 'InvalidToken', null);
    }

    if (error.response && error.status !== Code.INTERNAL_ERROR.code) {
      const preparedMessage = error.response?.message ? error.response.message : error.message;
      const isValidationError = !!Array.isArray(preparedMessage);
      const data = {
        message: isValidationError ? preparedMessage : [preparedMessage],
      };
      return CoreApiResponse.error(error.status, error.message, data, isValidationError);
    }

    if (!Number.parseInt(error.code) || error.code === Code.INTERNAL_ERROR.code) {
      return CoreApiResponse.error(Code.INTERNAL_ERROR.code, Code.INTERNAL_ERROR.message, null);
    }

    return errorResponse;
  }
}
