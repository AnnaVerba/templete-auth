import { Injectable } from '@nestjs/common';
import { Logger as LoggerService } from './logger.service';

@Injectable()
export class LoggerFacade {
  constructor(private logger: LoggerService) {}
  public log(msg, ...args: any[]): string {
    return this.logger.log(msg, ...args);
  }
  public error(msg, ...args: any[]): string {
    return this.logger.error(msg, ...args);
  }
  public warn(msg, ...args: any[]): string {
    return this.logger.warn(msg, ...args);
  }
  public trace(msg: any, ...args: any[]): any {
    this.logger.trace({ msg }, ...args);
  }
  public debug(msg, ...args: any[]): void {
    return this.logger.debug(msg, ...args);
  }
  public info(msg, ...args: any[]): string {
    return this.logger.log(msg, ...args);
  }
}
