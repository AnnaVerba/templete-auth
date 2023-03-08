import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ToRpcExceptionConverter } from '@app/shared/common/filters/to-rpc-exception.converter';
import { config } from 'dotenv';

config({ path: '.env' });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: Number.parseInt(process.env.PORT),
    },
  });

  app.useGlobalFilters(new ToRpcExceptionConverter());
  await app.listen();
}
bootstrap();
