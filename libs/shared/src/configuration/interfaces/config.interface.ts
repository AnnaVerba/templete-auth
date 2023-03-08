export interface IConfig {
  get(path?: string, defaults?): Promise<any>;
  getString(path: string, defaults?): Promise<string>;
  getBool(path: string, defaults?): Promise<boolean>;
  getNumber(path: string, defaults?): Promise<number>;
}
