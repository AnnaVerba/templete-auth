import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { UserController, RoleController, PermissionController } from './contollers';
import {
  ConfigModule,
  ENV,
  JwtService,
  MicroServicesEnum,
  RequestLoggerMiddleware,
  SharedModule,
  TokenConfigType,
} from '@app/shared';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { RequiredVariables } from './config/config';
import { AuthController } from './contollers/auth.controller';
import { JwtSignOptions } from '@nestjs/jwt';

const providers = [
  {
    provide: MicroServicesEnum.AUTH_MS,
    useFactory: async (configFacade: ConfigFacade): Promise<ClientProxyFactory> => {
      const options = {
        host: await configFacade.get('AUTH_MS_HOST'),
        port: await configFacade.getNumber('AUTH_MS_PORT'),
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
      } as TokenConfigType;
      const refreshOpt = {
        secret: await configFacade.get('ACCESS_SECRET'),
        expiresIn: await configFacade.get('REFRESH_TOKEN_EXPIRE_TIME'),
      } as JwtSignOptions;
      return new JwtService(accessOpt, refreshOpt);
    },
    inject: [ConfigFacade],
  },
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
];

const controllers = [UserController, RoleController, PermissionController, AuthController];

@Module({
  imports: [ConfigModule.forRoot(ENV, RequiredVariables), SharedModule],
  controllers,
  providers,
  exports: [...providers],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
