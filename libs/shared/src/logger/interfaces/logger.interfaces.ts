import { LoggerService } from '@nestjs/common';
import { LoggerOptions } from '../logger.types';

/**
 * Logger interface.
 *
 * @interface Logger
 */
export interface Logger extends LoggerService {
  /**
   * info - write log with info level.
   *
   * @function info
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * error - write log with error level.
   *
   * @function error
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * warn - write log with warn level.
   *
   * @function warn
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * debug - write log with debug level.
   *
   * @function debug
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  debug(message: string, ...args: unknown[]): void;

  // /**
  //  * setLevel - sets log level for logger globally.
  //  * Function is needed due to the dependency between
  //  * logger and configuration. Because of this dependency
  //  * it is required to set log level explicitly if not
  //  * default (warn) log level needed.
  //  *
  //  * @function setLevel
  //  * @param {LoggerOptions} options - option with log level.
  //  * @returns {void} - there is nothing to return.
  //  */
  // setLevel(options: LoggerOptions): void;
}
