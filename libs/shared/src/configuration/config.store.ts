import { get } from 'lodash';

export class ConfigStore {
  #data = {};

  get getData(): Object {
    return this.#data;
  }

  set set(data) {
    if (Object.prototype.hasOwnProperty.call(data, 'Key')) {
      try {
        data = '{' + JSON.stringify(data.Key) + ':' + JSON.stringify(data.Value) + '}';
        data = JSON.parse(data);
      } catch (error) {
        throw new Error('Can`t set data, error:' + error);
      }
    }
    this.#data = { ...this.#data, ...data };
  }

  get<T>(path: string, defaults?: T): string {
    return get(this.#data, path, defaults);
  }

  set setBatch(data) {
    if (!data) {
      throw new Error('Can`t set batch data in store');
    }
    this.#data = { ...this.#data, ...data };
  }
}
