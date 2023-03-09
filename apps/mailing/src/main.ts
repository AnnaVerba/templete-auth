import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MailingModule } from './mailing.module';
import { config } from 'dotenv';

config({ path: '.env' });
async function bootstrap(): Promise<void> {
  const microserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: process.env.MAILING_MS_HOST,
      port: process.env.MAILING_MS_PORT,
    },
  };
  const app = await NestFactory.createMicroservice(MailingModule, microserviceOptions);
  await app.listen();
}

bootstrap();
