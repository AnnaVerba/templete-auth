import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ENV,
  LoggerFacade,
  LoggerModule,
  MailService,
  MAILER_PROVIDER,
  RequiredVariables,
} from '@app/shared';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { PINO_LOGGER } from '@app/shared/logger/logger.consts';
import MailingFactory from './mailing.factory';
import MailingController from './mailing.controller';
const provider = {
  inject: [ConfigFacade, LoggerFacade],
  provide: MAILER_PROVIDER,
  useFactory: async (config: ConfigFacade, logger: LoggerFacade): Promise<MailService> => {
    const type = await config.get(RequiredVariables.MAILER_PROVIDER_TYPE);
    const factory = new MailingFactory(config, type);
    return factory.createClient(logger);
  },
};

@Module({
  imports: [ConfigModule.forRoot(ENV, RequiredVariables), LoggerModule.forRoot(PINO_LOGGER, { pinoHttp: {} })],
  providers: [provider, MailingController],
  controllers: [MailingController],
})
export class MailingModule {}
