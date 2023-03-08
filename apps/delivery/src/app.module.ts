import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './services';
import { MailController } from './contollers';
import { ConfigModule, ENV } from '@app/shared';

enum RequiredVariables {
  EMAIL_ID = 'EMAIL_ID',
  EMAIL_PASS = 'EMAIL_PASS',
}

const providers = [MailService];

const options = {
  transport: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env['EMAIL_ID'],
      pass: process.env['EMAIL_PASS'],
    },
  },
};

@Module({
  imports: [ConfigModule.forRoot(ENV, RequiredVariables), MailerModule.forRoot(options)],
  controllers: [MailController],
  providers,
  exports: [...providers],
})
export class AppModule {}
