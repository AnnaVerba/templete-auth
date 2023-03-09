import { MailerProviderResponse } from '@app/shared';

export class MailingResponse {
  /**
   *Send statusCode from mailer provider, if statusCode is not provided send Accepted (202)
   */
  public accept(message?): MailerProviderResponse {
    const code = message.statusCode;
    if (typeof code === typeof 'string') {
      const regex = /\d\.\d\.\d/g;
      const statusCode = code.match(regex)[0];
      return { statusCode: Number(statusCode.split('.').join('')), message: message.message };
    }
    if (code === undefined) {
      message.statusCode = 202;
    }
    return message;
  }
  /**
   *Send error statusCode  from mailer provider, if statusCode is not provided send BadRequest(400)
   */
  public error(message?): MailerProviderResponse {
    if (message.statusCode === undefined) {
      message.statusCode = 400;
    }
    return { statusCode: message.statusCode, message: message.message };
  }
}
