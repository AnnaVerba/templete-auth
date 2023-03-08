import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  JwtService,
  HttpRequest,
  UserManagementMessagePatternEnum,
  MicroServicesEnum,
  WithSessionsEnums,
} from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(MicroServicesEnum.USERMANAGEMENT_MS) private userClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: HttpRequest = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Invalid auth headers');
    }

    const { id } = this.jwtService.verifyAccess(accessToken);
    request.user = await lastValueFrom(
      this.userClient.send(UserManagementMessagePatternEnum.findUserById, {
        id,
        withSessions: WithSessionsEnums.Active,
      }),
    );
    if (request.user) {
      const currentSession = request.user.sessions.find((session) => session.ipAddress === request.ip);
      request.user.currentSessionId = currentSession.id;
    }

    return !!request.user?.currentSessionId;
  }
}
