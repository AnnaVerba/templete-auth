import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDataType } from '@app/shared';
import { RpcException } from '@nestjs/microservices';
import { ConfigFacade } from '@app/shared/configuration/config.facade';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configFacade: ConfigFacade) {}

  async sendEmail(data: EmailDataType): Promise<boolean> {
    const messageInLink = data.messageInLink || 'Click';
    const message = data.message || 'If you dont send request ignore this message';
    const html = data.url
      ? `<strong><a clicktracking=off href=${data.url}>${messageInLink}</a><br />${message}</strong>`
      : `<strong>${message}</strong>`;
    try {
      return !!(await this.mailerService.sendMail({
        to: data.email,
        from: await this.configFacade.get('EMAIL_ID'),
        subject: 'Template APP',
        text: 'welcome',
        html,
      }));
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
