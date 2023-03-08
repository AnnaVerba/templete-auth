/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from './interfaces/logger.interfaces';
import { LoggerOptions } from './logger.types';
import { Injectable } from '@nestjs/common';

/**
 * NopLoggerService implements Logger interface and makes
 * no operations.
 *
 * WARNING: NopLoggerService MUST be used for testing
 * purposes ONLY.
 */
@Injectable()
export class NopLoggerService implements Logger {
  /**
   * log - write log with info level.
   * It is required since we implement
   * LoggerFacade interface.
   *
   * @function log
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  log(message: string, ...args: unknown[]): void {
    return;
  }

  /**
   * info - write log with info level.
   *
   * @function info
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  info(message: string, ...args: unknown[]): void {
    return;
  }

  /**
   * error - write log with error level.
   *
   * @function error
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  error(message: string, ...args: unknown[]): void {
    return;
  }

  /**
   * warn - write log with warn level.
   *
   * @function warn
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  warn(message: string, ...args: unknown[]): void {
    return;
  }

  /**
   * debug - write log with debug level.
   *
   * @function debug
   * @param {String} message - message param.
   * @param {...unknown[]} args - additional log data.
   * @returns {void} - there is nothing to return.
   */
  debug(message: string, ...args: unknown[]): void {
    return;
  }

  /**
   * setLevel - sets log level for logger globally.
   * Function is needed due to the dependency between
   * logger and configuration. Because of this dependency
   * it is required to set log level explicitly if not
   * default (warn) log level needed.
   *
   * @function setLevel
   * @param {LoggerOptions} options - option with log level.
   * @returns {void} - there is nothing to return.
   */
  setLevel(options: LoggerOptions): void {
    return;
  }
}
