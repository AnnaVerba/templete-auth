import { Injectable } from '@nestjs/common';
import NodeCacheService from '@app/shared/cache/services/cache.node-cache.service';
import RedisService from '@app/shared/cache/services/cache.redis.service';
import { CACHE_PROVIDERS_TYPES, DEFAULT_TTL, NODE_CACHE_NAME, REDIS_CACHE_NAME } from '../constants/cache.constants';
import ValueTypes from '@app/shared/cache/types/cache-value.types';
import CacheServiceInterface from '@app/shared/cache/interfaces/cache.service.interface';

/**
 * @class CacheService
 * Creates an instance of class for working with selected cache (redis | node-cache).
 * Available methods: Set, Get, Take, Del, Ttl, GetTtl, Keys, Has, Close.
 */
@Injectable()
export default class CacheService<OptionsType> implements CacheServiceInterface {
  private readonly type: string;
  private readonly client: NodeCacheService | RedisService;

  constructor(type: string, options: OptionsType) {
    if (!type) {
      throw new SyntaxError(`Type not specified. Available types: ${CACHE_PROVIDERS_TYPES}`);
    }
    if (!CACHE_PROVIDERS_TYPES.includes(type)) {
      throw new RangeError(`Not valid type! Available types: ${CACHE_PROVIDERS_TYPES}`);
    }
    this.type = type;
    if (this.type === NODE_CACHE_NAME) {
      this.client = new NodeCacheService(options);
    }
    if (this.type === REDIS_CACHE_NAME) {
      this.client = new RedisService(options);
    }
  }

  async Set(key: string, value: ValueTypes, ttl: number = DEFAULT_TTL): Promise<boolean> {
    return await this.client.Set(key, value, ttl);
  }

  async Get(key: string): Promise<ValueTypes | null | undefined> {
    return await this.client.Get(key);
  }

  async Take(key: string): Promise<ValueTypes | null | undefined> {
    return await this.client.Take(key);
  }

  async Del(key: string): Promise<boolean> {
    const result = await this.client.Del(key);
    return result === 1;
  }

  async Ttl(key: string, ttl: number): Promise<boolean> {
    return await this.client.Ttl(key, ttl);
  }

  async GetTtl(key: string): Promise<number> {
    return await this.client.GetTtl(key);
  }

  async Keys(): Promise<string[]> {
    return await this.client.Keys();
  }

  async Has(key: string): Promise<boolean> {
    return await this.client.Has(key);
  }

  async FlushAll(): Promise<void> {
    await this.client.FlushAll();
  }

  async Close(): Promise<void> {
    await this.client.Close();
  }
}
