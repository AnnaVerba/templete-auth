import CacheService from './cache.service';
import { RedisClientOptions } from 'redis';
import { Options as NodeCacheOptions } from 'node-cache';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(r, ms));

describe('CacheService testing', () => {
  let firstService: CacheService<RedisClientOptions>, secondService: CacheService<NodeCacheOptions>;

  beforeAll(async () => {
    firstService = new CacheService<RedisClientOptions>('redis', {});
    secondService = new CacheService<NodeCacheOptions>('node-cache', {});
    await firstService.FlushAll();
    await secondService.FlushAll();
  });

  afterAll(async () => {
    await firstService.FlushAll();
    await secondService.FlushAll();
  });

  it('should be defined', () => {
    expect(firstService && secondService).toBeDefined();
  });

  it('should be an instance of CacheService', () => {
    expect(firstService && secondService).toBeInstanceOf(CacheService);
  });

  it('should return null or undefined when no key existing', async () => {
    const firstResult = await firstService.Get('GeneralCacheTest1.1');
    const secondResult = await secondService.Get('GeneralCacheTest1.2');
    expect(firstResult && secondResult).toBeFalsy();
  });

  it('should return value when data is valid', async () => {
    const firstResult = await firstService.Set('GeneralCacheTest2.1', 'value');
    const secondResult = await secondService.Set('GeneralCacheTest2.2', 'value');
    expect(firstResult && secondResult).toBeTruthy();
  });

  it('should return true when key exist in memory', async () => {
    await firstService.Set('GeneralCacheTest3.1', 'value');
    await secondService.Set('GeneralCacheTest3.2', 'value');
    const firstResult = await firstService.Has('GeneralCacheTest3.1');
    const secondResult = await secondService.Has('GeneralCacheTest3.2');
    expect(firstResult && secondResult).toBeTruthy();
  });

  it('should return array of keys in memory', async () => {
    const firstKeys = await firstService.Keys();
    const secondKeys = await secondService.Keys();
    await firstService.Set('GeneralCacheTest4.1', 'value');
    await secondService.Set('GeneralCacheTest4.2', 'value');
    await firstService.Set('GeneralCacheTest4.3', 'value2');
    await secondService.Set('GeneralCacheTest4.4', 'value2');
    const firstResult = await firstService.Keys();
    const secondResult = await secondService.Keys();
    expect(firstResult.length).toBe(firstKeys.length + 2);
    expect(secondResult.length).toBe(secondKeys.length + 2);
  });

  it('should return value when key exists in memory', async () => {
    await firstService.Set('GeneralCacheTest5.1', 'value');
    await secondService.Set('GeneralCacheTest5.2', 'value');
    const firstResult = await firstService.Get('GeneralCacheTest5.1');
    const secondResult = await secondService.Get('GeneralCacheTest5.2');
    expect(firstResult).toBe('value');
    expect(secondResult).toBe('value');
  });

  it('should delete item from memory', async () => {
    await firstService.Set('GeneralCacheTest6.1', 'value');
    await secondService.Set('GeneralCacheTest6.2', 'value');
    const firstResult = await firstService.Del('GeneralCacheTest6.1');
    const secondResult = await secondService.Del('GeneralCacheTest6.2');
    expect(firstResult && secondResult).toBeTruthy();
  });

  it('should get and delete item from memory', async () => {
    await firstService.Set('GeneralCacheTest7.1', 'value');
    await secondService.Set('GeneralCacheTest7.2', 'value');
    const firstResult = await firstService.Take('GeneralCacheTest7.1');
    const firstHasResult = await firstService.Has('GeneralCacheTest7.1');
    const secondResult = await secondService.Take('GeneralCacheTest7.2');
    const secondHasResult = await secondService.Has('GeneralCacheTest7.2');
    expect(firstResult).toBe('value');
    expect(firstHasResult).toBeFalsy();
    expect(secondResult).toBe('value');
    expect(secondHasResult).toBeFalsy();
  });

  it('should get undefined or null when key is expired', async () => {
    await firstService.Set('GeneralCacheTest8.1', 'value', 1);
    await secondService.Set('GeneralCacheTest8.2', 'value', 1);
    await sleep(1500);
    const firstResult = await firstService.Get('GeneralCacheTest8.1');
    const secondResult = await secondService.Get('GeneralCacheTest8.2');
    expect(firstResult).toBeNull();
    expect(secondResult).toBeUndefined();
  });

  it('should put ttl and compare to getTtl method', async () => {
    await firstService.Set('GeneralCacheTest9.1', 'value');
    await secondService.Set('GeneralCacheTest9.2', 'value');
    await firstService.Ttl('GeneralCacheTest9.1', Ttl);
    await secondService.Ttl('GeneralCacheTest9.2', Ttl);
    const firstResult = await firstService.GetTtl('GeneralCacheTest9.1');
    const secondResult = await secondService.GetTtl('GeneralCacheTest9.2');
    const result = firstResult > 59 && firstResult <= 60 && secondResult > 59 && secondResult <= 60;
    expect(result).toBeTruthy();
  });
});
