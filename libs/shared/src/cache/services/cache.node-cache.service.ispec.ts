import NodeCacheService from './cache.node-cache.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(r, ms));

describe('NodeCacheService testing', () => {
  let service: NodeCacheService;

  beforeAll(async () => {
    service = new NodeCacheService({});
    await service.FlushAll();
  });

  afterAll(async () => {
    await service.FlushAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be an instance of NodeCacheService', () => {
    expect(service).toBeInstanceOf(NodeCacheService);
  });

  it('should return undefined when no key existing', async () => {
    const result = await service.Get('NodeCacheTest1');
    expect(result).toBeUndefined();
  });

  it('should return value when data is valid', async () => {
    const result = await service.Set('NodeCacheTest2', 'value');
    expect(result).toBeTruthy();
  });

  it('should return true when key exist in memory', async () => {
    await service.Set('NodeCacheTest3', 'value');
    const result = await service.Has('NodeCacheTest3');
    expect(result).toBeTruthy();
  });

  it('should return array of keys in memory', async () => {
    const keys = await service.Keys();
    await service.Set('NodeCacheTest4.1', 'value');
    await service.Set('NodeCacheTest4.2', 'value2');
    const result = await service.Keys();
    expect(result.length).toBe(keys.length + 2);
  });

  it('should return value when key exists in memory', async () => {
    await service.Set('NodeCacheTest5', 'value');
    const result = await service.Get('NodeCacheTest5');
    expect(result).toBe('value');
  });

  it('should delete item from memory', async () => {
    await service.Set('NodeCacheTest6', 'value');
    const result = await service.Del('NodeCacheTest6');
    expect(result).toBe(1);
  });

  it('should get and delete item from memory', async () => {
    await service.Set('NodeCacheTest7', 'value');
    const result = await service.Take('NodeCacheTest7');
    const hasResult = await service.Has('NodeCacheTest7');
    expect(result).toBe('value');
    expect(hasResult).toBeFalsy();
  });

  it('should get undefined when key is expired', async () => {
    await service.Set('NodeCacheTest8', 'value', 1);
    await sleep(1500);
    const result = await service.Get('NodeCacheTest8');
    expect(result).toBeUndefined();
  });

  it('should put ttl and compare to getTtl method', async () => {
    const ttl = 60;
    await service.Set('NodeCacheTest9.1', 'value');
    await service.Ttl('NodeCacheTest9.1', ttl);
    const firstResult = await service.GetTtl('NodeCacheTest9.1');
    const result = firstResult > 59 && firstResult <= 60;
    expect(result).toBeTruthy();
  });
});
