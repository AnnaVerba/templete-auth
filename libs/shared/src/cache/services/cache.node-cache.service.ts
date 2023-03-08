import * as NodeCache from 'node-cache';
import { Injectable } from '@nestjs/common';
import ValueTypes from '../types/cache-value.types';
import { DEFAULT_TTL } from '../constants/cache.constants';

/**
 * @class NodeCacheService
 * Creates an instance of class for working with node-cache (in-memory cache).
 */
@Injectable()
export default class NodeCacheService {
  client: NodeCache;

  constructor(options: NodeCache.Options) {
    this.client = Object.keys(options).length === 0 ? new NodeCache() : new NodeCache(options);
  }

  async Set(key: string, value: any, ttl = DEFAULT_TTL): Promise<boolean> {
    return this.client.set(key, value, ttl);
  }

  async Get(key: string): Promise<ValueTypes | undefined> {
    return await this.client.get(key);
  }

  async Has(key: string): Promise<boolean> {
    return this.client.has(key);
  }

  async Keys(): Promise<Array<string>> {
    return this.client.keys();
  }

  async GetTtl(key: string): Promise<number> {
    return (this.client.getTtl(key) - Date.now()) / 1000;
  }

  async Del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async Ttl(key: string, ttl: number): Promise<boolean> {
    return this.client.ttl(key, ttl);
  }

  async Take(key: string): Promise<ValueTypes> {
    return await this.client.take(key);
  }

  async FlushAll(): Promise<void> {
    this.client.flushAll();
  }

  async Close(): Promise<void> {
    this.client.close();
  }
}
