import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@app/shared/configuration/config.module';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { MS } from '@app/shared/configuration';
describe('test MS2', () => {
  let app;
  let config: ConfigFacade;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(MS, {
          PORT: 'PORT',
          test: 'test',
        }),
      ],
    }).compile();
    config = moduleFixture.get(ConfigFacade);
    app = moduleFixture.createNestApplication();
    await app.connectMicroservice({
      transport: Transport.TCP,
    });
    app.startAllMicroservices();
    await app.init();
  });

  it('get method test', async () => {
    const result = await config.get('PORT', 1000);
    expect(result).toBe(8000);
  });

  it('getBool from MS test', async () => {
    const result = await config.getBool('test', false);
    expect(result).toBe(true);
  });
  it('getString from MS test', async () => {
    const result = await config.getString('test', false);
    expect(result).toStrictEqual('true');
  });
  it('getNumber from MS test', async () => {
    const result = await config.getNumber('PORT');
    expect(result).toStrictEqual(8000);
  });
});
