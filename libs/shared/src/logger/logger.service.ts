import { Inject, Injectable } from '@nestjs/common';
import { LoggerService as NestLogger } from '@nestjs/common';
import LoggerInit from '@app/shared/logger/logger.init';
import { Logger as ILogger } from '@app/shared/logger';
import { PinoLogger } from 'nestjs-pino';

// interface ILogger {
//   debug(msg, ...args: any[]): any;
//   error(msg: any, trace?: string, ...args: any[]): any;
//   info(msg: any, ...args: any[]): any;
//   warn(msg: any, ...args: any[]): any;
//   warn(msg: any, ...args: any[]): any;
//   trace(msg: any, ...args: any[]): any;
// }

@Injectable()
export class Logger implements NestLogger {
  private readonly logger: ILogger;
  constructor(@Inject(LoggerInit) loggerInit: LoggerInit<any>) {
    this.logger = loggerInit.CreateLogger();
  }

  debug(msg, ...args: any[]): any {
    this.logger.debug(msg, ...args);
  }

  error(msg: any, trace?: string, ...args: any[]): any {
    if (msg.message && msg.stack) {
      trace = msg.stack;
      msg = msg.message;
    }
    this.logger.error(msg, trace, ...args);
  }

  log(msg: any, ...args: any[]): any {
    this.logger.info(msg, ...args);
  }

  info(msg: any, ...args: any[]): any {
    this.logger.info(msg, ...args);
  }

  trace(msg: any, ...args: any[]): void {
    // this.logger.trace(msg, ...args);
  }

  warn(msg: any, ...args: any[]): any {
    this.logger.warn(msg, ...args);
  }
}
