import { Test, TestingModule } from '@nestjs/testing';
import { ConfigFacade } from '../../config.facade';
import { ENV } from '@app/shared/configuration';
import { ConfigModule } from '@app/shared';
import { env } from 'process';

describe('test env', () => {
  let app;
  let config: ConfigFacade;
  env.PORT = '8000';
  env.testing = 'false';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(ENV, {
          PORT: 'PORT',
          testing: 'testing',
        }),
      ],
    }).compile();
    config = moduleFixture.get<ConfigFacade>(ConfigFacade);
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('get configuration working', async () => {
    jest.spyOn(config, 'get');
    expect(await config.get('PORT', 6000)).toBe('8000');
  });
  it('get defaults with getBool ', async () => {
    const result = await config.getBool('testing', false);
    expect(result).toBe(false);
  });
  it('getString from .env-basic test', async () => {
    const result = await config.getString('PORT', false);
    expect(result).toStrictEqual('8000');
  });
  it('getNumber from .env-basic test', async () => {
    const result = await config.getNumber('PORT');
    expect(result).toStrictEqual(8000);
  });
});
