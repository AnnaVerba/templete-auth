import { Injectable } from '@nestjs/common';
import { MailingEnum } from '@app/shared/mailing/enum/mailing.enum';
import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { SendGridService } from './services/send-grid.service';
import { NodemailerService } from './services/nodemailer.service';
import { LoggerFacade, MailService } from '@app/shared';

@Injectable()
export default class MailingFactory {
  private readonly type: MailingEnum;
  private readonly config: ConfigFacade;

  constructor(config, type) {
    this.config = config;
    this.type = type;
  }
  /**
   * Create module for message sending
   *
   */
  async createClient(logger: LoggerFacade): Promise<MailService> {
    let client;
    switch (this.type) {
      case MailingEnum.SGMAIL: {
        client = new SendGridService(this.config, logger);
        break;
      }
      default: {
        client = new NodemailerService(this.config, logger);
        break;
      }
    }
    return client;
  }
}
