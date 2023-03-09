import { Test, TestingModule } from '@nestjs/testing';
import { MailingModule } from '../mailing.module';
import { MailingEnum } from '@app/shared/mailing/enum/mailing.enum';
import { LoggerFacade, MailService } from '@app/shared';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import MailingFactory from '../mailing.factory';
import MailingController from '../mailing.controller';

describe('Integration.test Nodemailer', () => {
  let service: MailService;
  let factory: MailingFactory;
  let controller: MailingController;
  let logger: LoggerFacade;
  let config: ConfigFacade;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MailingModule],
    }).compile();
    config = moduleFixture.get(ConfigFacade);
    factory = new MailingFactory(config, MailingEnum.NODEMAIL);
    logger = moduleFixture.get(LoggerFacade);
    service = await factory.createClient(logger);
    await service.onModuleInit();
    controller = new MailingController(service, logger);
  });

  it('Successfully sent with Nodemailer service', async () => {
    const msg = {
      to: 'verbaanna01@gmail.com',
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'text',
      html: '<strong>Hello</strong>',
    };
    const response = await controller.publish(msg);
    expect(response).toHaveProperty('statusCode', 200);
  });

  it('Nodemailer service must return 500', async () => {
    const msg = {
      to: '',
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'text',
      html: '<strong>Hello</strong>',
    };
    const response = await controller.publish(msg);

    expect(response).toHaveProperty('statusCode', 400);
  });
});
