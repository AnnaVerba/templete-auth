import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  LoggerFacade,
  MailService,
  MAILER_PROVIDER,
  MailerProviderResponse,
  SendMessageDto,
  SEND_MESSAGE_PATTERN,
  ValidationPipe,
} from '@app/shared';
import { MailingResponse } from './utils';

@Controller()
export default class MailingController {
  private readonly mailingService: MailService;
  private readonly logger: LoggerFacade;
  private readonly mailingResponse: MailingResponse;

  constructor(@Inject(MAILER_PROVIDER) mailingService: MailService, logger: LoggerFacade) {
    this.mailingService = mailingService;
    this.logger = logger;
    this.mailingResponse = new MailingResponse();
  }

  @MessagePattern(SEND_MESSAGE_PATTERN)
  async publish(
    @Payload(new ValidationPipe())
    payload: SendMessageDto,
  ): Promise<MailerProviderResponse> {
    try {
      const response = await this.mailingService.sendMessage(payload);
      return this.mailingResponse.accept(response);
    } catch (error) {
      return this.mailingResponse.error(error);
    }
  }
}
