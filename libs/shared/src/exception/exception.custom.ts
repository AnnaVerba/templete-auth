import { Injectable } from '@nestjs/common';
// TODO: Need to implement Exceptions
/**
 * Nest provides the following exceptions out of the box
 * https://docs.nestjs.com/exception-filters#built-in-http-exceptions
 *
 * In this file we can create custom exceptions
 */

/**
 * @class Exception - base error implementation (supports inner exception and additional data).
 */
@Injectable()
export class Exception extends Error {
  innerException: Error | unknown;
  data: unknown;

  constructor(message: string, error: Error | unknown, data: unknown) {
    super(message);

    this.name = this.constructor.name;
    this.innerException = error;
    this.data = data;
  }
}
