import { NestFactory } from '@nestjs/core';
import { UserManagementModule } from './user-management.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ToRpcExceptionConverter } from '@app/shared/common/filters/to-rpc-exception.converter';
import { config } from 'dotenv';

config({ path: '.env-basic' });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserManagementModule, {
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
