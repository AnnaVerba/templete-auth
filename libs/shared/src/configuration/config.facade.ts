import { Inject, Injectable, Logger } from '@nestjs/common';
import ConfigFactory from '@app/shared/configuration/config.factory';
import { IConfig } from '@app/shared/configuration/index';

@Injectable()
export class ConfigFacade implements IConfig {
  client;
  private readonly configInit: ConfigFactory;
  private readonly logger: Logger;
  constructor(@Inject(ConfigFactory) configInit: ConfigFactory, logger: Logger) {
    this.configInit = configInit;
    this.client = this.configInit;
    this.logger = logger;
  }
  public async get(path: string, defaults?): Promise<any> {
    try {
      return this.client.get(path, defaults);
    } catch (error) {
      return this.logger.error('ERROR', error);
    }
  }

  public async getString(path: string, defaults?): Promise<string> {
    try {
      return await this.client.getString(path, defaults);
    } catch (error) {
      this.logger.error('ERROR', error);
    }
  }
  public async getBool(path: string, defaults?): Promise<boolean> {
    try {
      return await this.client.getBool(path, defaults);
    } catch (error) {
      this.logger.error('ERROR', error);
    }
  }
  public async getNumber(path: string, defaults?): Promise<number> {
    try {
      return await this.client.getNumber(path, defaults);
    } catch (error) {
      this.logger.error('ERROR', error);
    }
  }
}
