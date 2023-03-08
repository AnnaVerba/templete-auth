import { ConfigFacade } from '../../config.facade';
import { Test, TestingModule } from '@nestjs/testing';
import * as Consul from 'consul';
import { CONSUL } from '@app/shared/configuration';
import { ConfigModule } from '@app/shared';
describe('test consul', () => {
  let app;
  let config: ConfigFacade;
  let consul: Consul;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(CONSUL, {
          TEST: 'TEST',
        }),
      ],
    }).compile();
    config = moduleFixture.get<ConfigFacade>(ConfigFacade);
    consul = new Consul();
    await consul.kv.set('testing', 'true');
    await consul.kv.set('getNumber', '4');
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('get method test', async () => {
    const result = await config.get('testing', false);
    expect(result).toBe('true');
  });
  it('getBool method test', async () => {
    const result = await config.getBool('testing', false);
    expect(result).toBe(true);
  });
  it('getString method test', async () => {
    const result = await config.getString('testing', false);
    expect(typeof result).toBe('string');
  });
  it('getNumber method test', async () => {
    const result = await config.getNumber('getNumber');
    expect(result).toStrictEqual(4);
  });
});
