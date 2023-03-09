import { NodemailerService } from '../../../../../apps/mailing/src/services/nodemailer.service';
import { SendGridService } from '../../../../../apps/mailing/src/services/send-grid.service';

export type MailService = NodemailerService | SendGridService;
export type emailType = string | string[];
