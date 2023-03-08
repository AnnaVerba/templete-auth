import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { ConfigModule, ENV } from '../configuration';
import { ConfigFacade } from '../configuration/config.facade';

enum RequiredFields {
  DATABASE_URL = 'DATABASE_URL',
  IS_SUPPORT_SSL = 'IS_SUPPORT_SSL',
}

@Module({
  imports: [
    ConfigModule.forRoot(ENV, RequiredFields),
    SequelizeModule.forRootAsync({
      useFactory: async (configFacade: ConfigFacade) => {
        const options = {
          uri: await configFacade.get('DATABASE_URL'),
          dialect: 'postgres' as Dialect,
          autoLoadModels: true,
          models: [__dirname + '/../**/*.model.ts'],
          synchronize: true,
          logging: false,
          dialectOptions: (await configFacade.getBool('IS_SUPPORT_SSL'))
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
        };
        return { ...options };
      },
      inject: [ConfigFacade],
    }),
  ],
})
export class DatabaseModule {}
