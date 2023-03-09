import { Test, TestingModule } from '@nestjs/testing';
import { MailingModule } from '../mailing.module';
import { MailingEnum } from '@app/shared/mailing/enum/mailing.enum';
import { LoggerFacade, MailService } from '@app/shared';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import MailingController from '../mailing.controller';
import MailingFactory from '../mailing.factory';

describe('Integration.test SendGrid', () => {
  let service: MailService;
  let controller: MailingController;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MailingModule],
    }).compile();
    const config = moduleFixture.get(ConfigFacade);

    const factory = new MailingFactory(config, MailingEnum.SGMAIL);
    const logger = moduleFixture.get(LoggerFacade);
    service = await factory.createClient(logger);
    await service.onModuleInit();
    controller = new MailingController(service, logger);
  });
  it('Successfully sent with SendGrid service', async () => {
    const msg = {
      to: 'verbaanna01@gmail.com',
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'text',
      html: '<strong>Hello</strong>',
    };
    const response = await controller.publish(msg);
    expect(response).toHaveProperty('statusCode', 202);
  });

  it('SendGrid service must return 500', async () => {
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
