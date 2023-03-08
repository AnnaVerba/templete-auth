import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from '../services';
import { DeliveryMessagePatternEnum, EmailDataType } from '@app/shared';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(DeliveryMessagePatternEnum.sendEmail)
  async sendEmail(data: EmailDataType): Promise<boolean> {
    return await this.mailService.sendEmail(data);
  }
}
