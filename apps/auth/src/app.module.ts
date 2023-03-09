import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthController } from './contollers';
import { AuthService } from './services';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule, JwtService, BcryptService, MicroServicesEnum, ENV, ConfigModule } from '@app/shared';
import { GoogleAuthService } from './providers/google/google-auth.service';
import { FacebookAuthService } from './providers/facebook/facebook-auth.service';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { GoogleServiceOptions } from './providers/google/types';
import { FacebookServiceOptions } from './providers/facebook/types';
import { RequiredVariables } from './config/config';

const providers = [
  {
    provide: MicroServicesEnum.USERMANAGEMENT_MS,
    useFactory: async (configFacade: ConfigFacade): Promise<ClientProxyFactory> => {
      const options = {
        host: await configFacade.get('USERMANAGEMENT_MS_HOST'),
        port: await configFacade.getNumber('USERMANAGEMENT_MS_PORT'),
      };
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: options,
      });
    },
    inject: [ConfigFacade],
  },
  {
    provide: JwtService,
    useFactory: async (configFacade: ConfigFacade): Promise<JwtService> => {
      const accessOpt = {
        secret: await configFacade.get('ACCESS_SECRET'),
        expiresIn: await configFacade.get('ACCESS_TOKEN_EXPIRE_TIME'),
      };
      const refreshOpt = {
        secret: await configFacade.get('ACCESS_SECRET'),
        expiresIn: await configFacade.get('REFRESH_TOKEN_EXPIRE_TIME'),
      };
      return new JwtService(accessOpt, refreshOpt);
    },
    inject: [ConfigFacade],
  },
  {
    provide: GoogleAuthService,
    useFactory: async (configFacade: ConfigFacade): Promise<GoogleAuthService> => {
      const options: GoogleServiceOptions = [
        await configFacade.get('GOOGLE_CLIENT_ID'),
        await configFacade.get('GOOGLE_CLIENT_SECRET'),
        await configFacade.get('GOOGLE_AUTH_REDIRECT_URL'),
      ];
      return new GoogleAuthService(options);
    },
    inject: [ConfigFacade],
  },
  {
    provide: FacebookAuthService,
    useFactory: async (configFacade: ConfigFacade): Promise<FacebookAuthService> => {
      const options: FacebookServiceOptions = {
        appId: await configFacade.get('FACEBOOK_APP_ID'),
        appSecret: await configFacade.get('FACEBOOK_APP_SECRET'),
        callbackURL: await configFacade.get('FACEBOOK_AUTH_REDIRECT_URL'),
      };
      return new FacebookAuthService(options);
    },
    inject: [ConfigFacade],
  },
  {
    provide: MicroServicesEnum.MAILING_MS,
    useFactory: async (configFacade: ConfigFacade): Promise<ClientProxyFactory> => {
      const options = {
        host: await configFacade.get('MAILING_MS_HOST'),
        port: await configFacade.getNumber('MAILING_MS_PORT'),
      };
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: options,
      });
    },
    inject: [ConfigFacade],
  },
  AuthService,
  BcryptService,
];

@Module({
  imports: [ConfigModule.forRoot(ENV, RequiredVariables), SharedModule, ScheduleModule.forRoot()],
  controllers: [AuthController],
  providers,
  exports: [...providers],
})
export class AppModule {}
