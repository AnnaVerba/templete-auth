import { DynamicModule, Logger, Module } from '@nestjs/common';
import ConfigFactory from './config.factory';
import { ConfigFacade } from './config.facade';
import { ConfigStore } from './config.store';
import { isEmpty } from 'class-validator';
@Module({
  providers: [ConfigStore, Logger],
  exports: [ConfigStore],
})
export class ConfigModule {
  static forRoot(type: string, requiredVariables?: { [key: string]: string }): DynamicModule {
    if (isEmpty(requiredVariables)) {
      requiredVariables = {};
    }
    const initProvider = {
      provide: ConfigFactory,

      useFactory: async (): Promise<any> => {
        const provider = new ConfigFactory(type, new ConfigStore());
        const client = await provider.CreateClient();

        for (const key of Object.values(requiredVariables)) {
          if (!client.get(key as string)) {
            throw new Error(`Key must be provided: ${key}`);
          }
        }

        return client;
      },
    };

    return {
      global: true,
      module: ConfigModule,
      providers: [ConfigFacade, initProvider],
      exports: [ConfigFacade, initProvider],
    };
  }
}
