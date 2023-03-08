import { Injectable, Logger } from '@nestjs/common';
import * as Consul from 'consul';
import { ConfigStore, CONSUL, ConsulConfig, ENV, EnvConfig, MS } from '@app/shared/configuration/index';
import { MSConfig } from '@app/shared/configuration/services/config.ms';

@Injectable()
export default class ConfigFactory {
  type: string;
  constructor(type: string, private readonly store: ConfigStore) {
    if (!type) {
      throw new SyntaxError(`Type not specified. Available types`);
    }

    this.type = type;
  }
  async CreateClient(): Promise<any> {
    let client;
    switch (this.type) {
      case CONSUL: {
        client = new ConsulConfig(new Consul(), this.store, new Logger('Consul'));

        break;
      }

      case ENV: {
        client = new EnvConfig(this.store, new Logger('EnvConfig'));

        break;
      }
      case MS: {
        client = new MSConfig(this.store);

        break;
      }
    }

    /**
     * This decorator is needed to prevent Nest from calling the
     * client.onModuleInit method multiple times. The binding is needed
     * because in nested functions the method will have a wrong 'this'
     */
    const realMethod = client.onModuleInit.bind(client);
    client.onModuleInit = (function callCounterDecorator(): () => Promise<any> {
      let callNumber = 0;
      return async function wrapper() {
        if (callNumber === 0) {
          callNumber += 1;
          return await realMethod();
        }
      };
    })();

    /**
     * Here we call this method manually as early as possible,
     * because Nest may call it too late, after instantiation of other
     * modules and providers, so they will have 'undefined' configuration
     */
    await client.onModuleInit();

    return client;
  }
}
