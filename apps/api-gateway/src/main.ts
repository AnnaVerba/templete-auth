import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestHttpExceptionFilter, TimeoutInterceptor } from '@app/shared';
import cookie from '@fastify/cookie';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { ConfigFacade } from '@app/shared/configuration/config.facade';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const logger = new Logger('bootstrap');

  const configFacade = app.get(ConfigFacade);

  app.register(cookie, {
    secret: await configFacade.get('COOKIE_SECRET'),
    parseOptions: {},
  });

  app.enableCors({
    origin: (await configFacade.get('CORS_ORIGINS')).split(','),
    credentials: true,
  });
  app.useGlobalFilters(new NestHttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, disableErrorMessages: false }));
  app.useGlobalInterceptors(new TimeoutInterceptor(5000));

  const options = new DocumentBuilder()
    .setTitle('Template - API')
    .setDescription('API Gateway')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  process.on('unhandledRejection', (reason: unknown, p: unknown) => {
    const message = `Unhandled Rejection at: Promise: ${p}, reason: ${reason}`;
    // eslint-disable-next-line no-console
    console.error(message);
    logger.error(message);
    process.abort();
  });
  process.on('uncaughtException', (err: unknown, origin: unknown) => {
    const message = `Unhandled Exception at: ${err}: err, origin: ${origin}`;
    // eslint-disable-next-line no-console
    console.error(message);
    logger.error(message);
    process.abort();
  });

  await app.listen(await configFacade.getNumber('PORT'), await configFacade.getString('HOST'));
}

bootstrap();
