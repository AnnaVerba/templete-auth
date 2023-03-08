import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger';
import { HttpExceptionFilter } from './exception.filters';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [HttpExceptionFilter],
  exports: [HttpExceptionFilter],
})
export class ExceptionModule {}
