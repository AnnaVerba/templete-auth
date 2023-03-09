import { ConfigFacade } from '@app/shared/configuration/config.facade';
import { LoggerFacade } from '@app/shared';
import { SendMessageDto } from '@app/shared/mailing/dto/send-message.dto';

export interface IMailing {
  readonly config: ConfigFacade;
  readonly logger: LoggerFacade;
  sendMessage(data: SendMessageDto): Promise<any>;
}
