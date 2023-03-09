export const SEND_MESSAGE_PATTERN = 'SendMessagePattern';
export const MAILER_PROVIDER = 'Provider';
export enum RequiredVariables {
  EMAIL_ID = 'EMAIL_ID',
  /**
   * @param  MAILER_PROVIDER_TYPE- should be provided in configuration, can be 'sgMail' or 'nodeMail'
   */
  MAILER_PROVIDER_TYPE = 'MAIL',
  NODEMAILER_SERVICE = 'NODEMAILER_SERVICE',
  NODEMAILER_HOST = 'NODEMAILER_HOST',
  EMAIL_PASS = 'EMAIL_PASS',
  SENDGRID_API_KEY = 'SENDGRID_API_KEY',
}
