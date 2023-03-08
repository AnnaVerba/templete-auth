import RedisService from './cache.redis.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(r, ms));

describe('RedisService testing', () => {
  let service: RedisService;

  beforeAll(async () => {
    service = new RedisService({});
    await service.FlushAll();
  });

  afterAll(async () => {
    await service.FlushAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be an instance of RedisService', () => {
    expect(service).toBeInstanceOf(RedisService);
  });

  it('should return null when no key existing', async () => {
    const result = await service.Get('RedisTest1');
    expect(result).toBeNull();
  });

  it('should return value when data is valid', async () => {
    const result = await service.Set('RedisTest2', 'value');
    expect(result).toBeTruthy();
  });

  it('should return true when key exist in memory', async () => {
    await service.Set('RedisTest3', 'value');
    const result = await service.Has('RedisTest3');
    expect(result).toBeTruthy();
  });

  it('should return array of keys in memory', async () => {
    const keys = await service.Keys();
    await service.Set('RedisTest4.1', 'value');
    await service.Set('RedisTest4.2', 'value2');
    const result = await service.Keys();
    expect(result.length).toBe(keys.length + 2);
  });

  it('should return value when key exists in memory', async () => {
    await service.Set('RedisTest5', 'value');
    const result = await service.Get('RedisTest5');
    expect(result).toBe('value');
  });

  it('should delete item from memory', async () => {
    await service.Set('RedisTest6', 'value');
    const result = await service.Del('RedisTest6');
    expect(result).toBe(1);
  });

  it('should get and delete item from memory', async () => {
    await service.Set('RedisTest7', 'value');
    const result = await service.Take('RedisTest7');
    const hasResult = await service.Has('RedisTest7');
    expect(result).toBe('value');
    expect(hasResult).toBeFalsy();
  });

  it('should get null when key is expired', async () => {
    await service.Set('RedisTest8', 'value', 1);
    await sleep(1500);
    const result = await service.Get('RedisTest8');
    expect(result).toBeNull();
  });

  it('should put ttl and compare to getTtl method', async () => {
    const ttl = 60;
    await service.Set('RedisTest9.1', 'value');
    await service.Ttl('RedisTest9.1', ttl);
    const firstResult = await service.GetTtl('RedisTest9.1');
    const result = firstResult > 59 && firstResult <= 60;
    expect(result).toBeTruthy();
  });
});
