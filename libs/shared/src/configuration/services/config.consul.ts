import { Logger, OnModuleInit } from '@nestjs/common';
import * as Consul from 'consul';
import { ConfigStore } from '../config.store';
import { IConfig } from '@app/shared/configuration';

export class ConsulConfig implements OnModuleInit, IConfig {
  private readonly consul: Consul;

  constructor(consul: Consul, private readonly store: ConfigStore, private readonly logger: Logger) {
    this.consul = consul;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.getFromConsul();
      await this.createWatcher();
    } catch (error) {
      this.logger.error('Unable to receive data from consul , retrying...', error);
    }
  }

  async getFromConsul(): Promise<void> {
    const keys = await this.consul.kv.keys();
    const data = await Promise.all(keys.map((item) => this.consul.kv.get(item)));
    for (const item of data) {
      this.store.set = item;
    }
    this.logger.log('Data was set to store', this.store.getData);
  }

  async get(path?: string, defaults?): Promise<string | Object> {
    if (!path) {
      return this.store.getData;
    }
    return this.store.get(path, defaults);
  }

  public async getString(path: string, defaults?): Promise<string> {
    return this.store.get(path, defaults).toString();
  }

  public async getBool(path: string, defaults?): Promise<boolean> {
    return JSON.parse(this.store.get(path, defaults));
  }

  public async getNumber(path: string, defaults?): Promise<number> {
    return Number(this.store.get(path, defaults));
  }

  private createWatcher(): void {
    const watch = this.consul.watch({
      method: this.consul.kv.keys,
    });

    watch.on('change', async (data, res) => {
      await this.getFromConsul();
      this.logger.log('watcher data:', res);
    });

    watch.on('error', (err) => {
      this.logger.log('error:', err);
    });
  }
}
