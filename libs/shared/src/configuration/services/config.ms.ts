import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom, map, Observable } from 'rxjs';
import { OnModuleInit } from '@nestjs/common';
import { ConfigEnums } from '@app/shared/configuration/enums/config.enums';
import { ConfigStore, IConfig } from '@app/shared/configuration';
export class MSConfig implements OnModuleInit, IConfig {
  private client: ClientProxy;

  constructor(private readonly store: ConfigStore) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 8000,
      },
    });
  }
  async onModuleInit(): Promise<Observable<any>> {
    return await lastValueFrom(
      this.client.send(ConfigEnums.getMS, 'TEST').pipe(
        map((res) => {
          this.store.set = res;
          return res;
        }),
      ),
    );
  }
  get(path?: string, defaults?): any {
    if (!path) {
      return this.store.getData;
    }

    return this.store.get(path, defaults);
  }

  public async getString(path: string, defaults?): Promise<string> {
    const result = this.store.get(path, defaults);
    return result.toString();
  }
  public async getBool(path: string, defaults?): Promise<boolean> {
    const result = this.store.get(path, defaults);

    return JSON.parse(result);
  }
  public async getNumber(path: string, defaults?): Promise<number> {
    const result = this.store.get(path, defaults);
    return Number(result);
  }
}
