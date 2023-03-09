import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IMailing, RequiredVariables, MailerProviderResponse, SendMessageDto } from '@app/shared/mailing';
import { LoggerFacade } from '@app/shared';
import { isNotEmpty } from 'class-validator';
import { ConfigFacade } from '@app/shared/configuration/config.facade';

@Injectable()
export class NodemailerService implements OnModuleInit, IMailing {
  transport: nodemailer.transport;
  config: ConfigFacade;
  logger: LoggerFacade;
  mailer: nodemailer;

  constructor(config, logger: LoggerFacade) {
    this.config = config;
    this.logger = logger;
    this.mailer = nodemailer;
  }
  /**
   *Create transport for nodemailer
   */
  async onModuleInit(): Promise<void> {
    try {
      const emailId = await this.config.get(RequiredVariables.EMAIL_ID);
      const nodemailerService = await this.config.get(RequiredVariables.NODEMAILER_SERVICE);
      const nodemailerHost = await this.config.get(RequiredVariables.NODEMAILER_HOST);
      const emailPass = await this.config.get(RequiredVariables.EMAIL_PASS);
      this.transport = this.mailer.createTransport({
        service: nodemailerService,
        host: nodemailerHost,
        auth: {
          user: emailId,
          pass: emailPass,
        },
      });
    } catch (error) {
      this.logger.error(`Configuration for nodemailer failed: ${error}`);
    }
  }
  /**
   * Send message with nodemailer
   */
  async sendMessage(data: SendMessageDto): Promise<MailerProviderResponse> {
    this.logger.log('Nodemailer sending message');
    try {
      const response = await this.transport.sendMail(data);
      if (isNotEmpty(response.rejectedErrors)) {
        return { statusCode: response.rejectedErrors[0].responseCode, message: response.rejectedErrors[0].response };
      }
      return { statusCode: response.response, message: response };
    } catch (error) {
      const errorResponse = new Error('Failed to send an email with Nodemailer provider');
      errorResponse.message = 'Failed to send an email';
      errorResponse['statusCode'] = error.responseCode;
      throw errorResponse;
    }
  }
}
