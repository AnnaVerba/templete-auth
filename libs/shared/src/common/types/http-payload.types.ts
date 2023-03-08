import { FastifyRequest } from 'fastify';

import { AuthUser } from '@app/shared/common';

export type MetadataType = {
  userId?: string;
};

export interface HttpRequest extends FastifyRequest {
  user?: AuthUser;
  metadata?: MetadataType;
  cookies: { [cookieName: string]: string | undefined };
}
