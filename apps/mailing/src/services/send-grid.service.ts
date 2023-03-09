import { Injectable, OnModuleInit } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { SendMessageDto } from '@app/shared/mailing/dto/send-message.dto';
import { LoggerFacade, MailerProviderResponse } from '@app/shared';
import { IMailing } from '@app/shared/mailing/interface/mailing.interface';
import { RequiredVariables } from '@app/shared/mailing/constants/config.consts';
import { ConfigFacade } from '@app/shared/configuration/config.facade';

@Injectable()
export class SendGridService implements OnModuleInit, IMailing {
  config: ConfigFacade;
  logger: LoggerFacade;

  constructor(config, logger: LoggerFacade) {
    this.config = config;
    this.logger = logger;
  }
  /**
   *Create transport for SendGrid
   */
  async onModuleInit(): Promise<void> {
    try {
      const key = await this.config.get(RequiredVariables.SENDGRID_API_KEY);
      SendGrid.setApiKey(key);
    } catch (error) {
      throw new Error(`SENDGRID_API_KEY not provided ${error}`);
    }
  }
  /**
   *Send message with SendGrid
   */
  async sendMessage(data: SendMessageDto): Promise<MailerProviderResponse> {
    this.logger.log('SendGrid sending message');
    try {
      const response = await SendGrid.send(data);
      return { statusCode: response[0].statusCode, message: response[0].headers };
    } catch (error) {
      const errorResponse = new Error('Failed to send an email with SendGrid provider');
      errorResponse.message = 'Failed to send an email';
      errorResponse['statusCode'] = error.code;
      throw errorResponse;
    }
  }
}
