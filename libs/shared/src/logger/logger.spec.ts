import { LoggerModule, LoggerFacade } from '@app/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { PINO_LOGGER } from './logger.consts';
import { PinoLogger } from 'nestjs-pino';
describe('Logger test', () => {
  let logger: LoggerFacade;
  let app;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot<PinoLogger>(PINO_LOGGER, {
          pinoHttp: {
            autoLogging: false,
            transport: {
              target: 'pino-pretty',
              options: {
                destination: './log',
                ignore: 'req,hostname,pid',
                colorize: false,
                levelFirst: true,
                translateTime: 'SYS:standard',
              },
            },
          },
        }),
      ],
    }).compile();
    logger = moduleFixture.get<LoggerFacade>(LoggerFacade);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('logger working', async () => {
    const log = jest.spyOn(logger, 'log');
    const logWarn = jest.spyOn(logger, 'warn');
    logger.log('first test');
    logger.warn('warning');
    expect(log).toHaveBeenCalledWith('first test');

    expect(logWarn.mock.calls).toContainEqual(['warning']);
  });

  it('no logs', async () => {
    const logSpy = jest.spyOn(logger, 'log');
    expect(logSpy).not.toHaveBeenCalledWith();
  });
});
