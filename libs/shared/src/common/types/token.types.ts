import { TokenTypeEnum } from '../';

export type TokenConfigType = {
  secret: string;
  expiresIn: string;
};

export type PayloadTokenType = {
  id?: string;
  email?: string;
  type?: TokenTypeEnum;
  sessionId?: string;
  oneTimeLinkId?: string;
};
