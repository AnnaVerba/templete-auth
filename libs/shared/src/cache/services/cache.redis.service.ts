import { createClient, RedisClientOptions } from 'redis';
import { Injectable } from '@nestjs/common';
import ValueTypes from '../types/cache-value.types';
import { DEFAULT_TTL } from '../constants/cache.constants';

/**
 * @class RedisService
 * Creates an instance of class for working with redis (in-memory database).
 */
@Injectable()
export default class RedisService {
  client: ReturnType<typeof createClient>;

  constructor(options: RedisClientOptions) {
    this.client = Object.keys(options).length === 0 ? createClient() : createClient(options);
    this.client.on('error', (err: object) => console.log('Redis Client Error', err));
    this.On();
  }

  async On(): Promise<void> {
    await this.client.connect();
  }

  async Set(key: string, value: any, ttl = DEFAULT_TTL): Promise<boolean> {
    await this.client.SET(key, value);
    return await this.client.EXPIRE(key, ttl);
  }

  async Get(key: string): Promise<ValueTypes | null> {
    return await this.client.GET(key);
  }

  async Has(key: string): Promise<boolean> {
    return (await this.client.EXISTS(key)) === 1;
  }

  async Keys(): Promise<Array<string>> {
    return await this.client.KEYS('*');
  }

  async GetTtl(key: string): Promise<number> {
    return await this.client.TTL(key);
  }

  async Del(key: string): Promise<number> {
    return await this.client.DEL(key);
  }

  async Ttl(key: string, ttl: number): Promise<boolean> {
    return await this.client.EXPIRE(key, ttl);
  }

  async Take(key: string): Promise<ValueTypes> {
    const value = await this.Get(key);
    await this.Del(key);
    return value;
  }

  async FlushAll(): Promise<void> {
    await this.client.FLUSHALL();
  }

  async Close(): Promise<void> {
    await this.client.disconnect();
  }
}
