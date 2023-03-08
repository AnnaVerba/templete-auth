import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/interfaces/index';

@Injectable()
export default class LoggerInit<T> {
  type: string;
  options: T;
  constructor(type: string, options: T) {
    if (!type) {
      throw new SyntaxError(`Type not specified. Available types`);
    }
    this.type = type;
    this.options = options;
  }
  CreateLogger(): Logger {
    switch (this.type) {
      default: {
        return new PinoLogger(this.options) as unknown as Logger;
      }
    }
  }
}
