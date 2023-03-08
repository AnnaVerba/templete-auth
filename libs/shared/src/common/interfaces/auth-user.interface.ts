import { User } from '@app/shared/models';

export interface AuthUser extends User {
  currentSessionId: string;
}
