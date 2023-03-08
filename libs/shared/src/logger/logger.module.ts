import { DynamicModule, Module } from '@nestjs/common';
import { Logger as LoggerService } from './logger.service';
import { LoggerFacade } from './logger.facade';
import LoggerInit from './logger.init';
import { isEmpty } from 'class-validator';

@Module({
  providers: [LoggerService, LoggerFacade, LoggerInit, String, Object],
  exports: [LoggerService, LoggerFacade],
})
export class LoggerModule {
  static forRoot<T>(type: string, options?: any): DynamicModule {
    if (isEmpty(options)) {
      switch (type) {
        default: {
          options = { pinoHttp: {} };
          break;
        }
      }
    }
    const optionsTyped: T = { ...options };
    const initProvider = {
      provide: LoggerInit,
      useFactory: (): LoggerInit<T> => {
        return new LoggerInit<T>(type, optionsTyped);
      },
    };
    return {
      global: true,
      module: LoggerModule,
      providers: [initProvider],
      exports: [initProvider],
    };
  }
}
