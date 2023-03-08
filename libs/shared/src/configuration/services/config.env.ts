import { Logger, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigStore } from '../config.store';
import { IConfig } from '@app/shared/configuration';
dotenv.config();
export class EnvConfig implements OnModuleInit, IConfig {
  constructor(private readonly store: ConfigStore, private readonly logger: Logger) {}
  async onModuleInit(): Promise<void> {
    try {
      this.store.setBatch = process.env;
      this.logger.log('Data from env received');
    } catch (error) {
      this.logger.error('Unable to receive data from env file, error:', error);
    }
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
