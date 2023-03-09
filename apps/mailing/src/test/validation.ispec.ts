import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { MAILER_PROVIDER, SendMessageDto, SEND_MESSAGE_PATTERN } from '@app/shared/mailing';
import MailingController from '../mailing.controller';
import { INestApplication } from '@nestjs/common';
import { NodemailerService } from '../services/nodemailer.service';
import { MailingModule } from '../mailing.module';

describe('Mailing validation', () => {
  let service: NodemailerService;
  let app: INestApplication;
  let spyService;
  let controller: MailingController;
  let client;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MailingModule,
        ClientsModule.register([
          {
            name: 'Client_Service',
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: 3007,
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.connectMicroservice({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3007,
      },
    });
    await app.startAllMicroservices();
    await app.init();
    client = app.get('Client_Service');
    await client.connect();
    controller = moduleFixture.get(MailingController);
    service = moduleFixture.get(MAILER_PROVIDER);
    spyService = jest.spyOn(service, 'sendMessage');
  });
  afterAll(async () => {
    await app.close();
  });
  it('Successful validation', async () => {
    const msg = {
      to: 'verbaanna01@gmail.com',
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'null',
      html: '<strong>Hello</strong>',
    };
    const response: Observable<any> = await lastValueFrom(client.send(SEND_MESSAGE_PATTERN, msg));

    expect(response).toHaveProperty('statusCode', 202);
  });

  it('Validation failed (subject is null))', async () => {
    const msg: SendMessageDto = {
      to: 'verbaanna01@gmail.com',
      from: 'verbaanna01@gmail.com',
      subject: null,
      text: 'text',
      html: '<strong>Hello</strong>',
    };
    try {
      await lastValueFrom(client.send(SEND_MESSAGE_PATTERN, msg));
    } catch (error) {
      expect(error.message).toBe(`Validation failed: subject must be shorter than or equal to 998 characters`);
    }
  });

  it('Null data in field (to)', async () => {
    const msg = {
      to: null,
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'text',
      html: '<strong>Hello</strong>',
    };
    try {
      await lastValueFrom(client.send(SEND_MESSAGE_PATTERN, msg));
    } catch (error) {
      expect(error.message).toBe(`Validation failed: to should not be empty`);
    }
  });
  it('Undefined field (to)', async () => {
    const msg = {
      to: undefined,
      from: 'verbaanna01@gmail.com',
      subject: 'Sending with SendGrid',
      text: 'text',
      html: '<strong>Hello</strong>',
    };

    try {
      await lastValueFrom(client.send(SEND_MESSAGE_PATTERN, msg));
    } catch (error) {
      expect(error.message).toBe(`Validation failed: to should not be empty`);
    }
  });
});
