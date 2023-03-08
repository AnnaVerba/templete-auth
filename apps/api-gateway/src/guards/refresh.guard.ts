import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JwtService,
  HttpRequest,
  TokenTypeEnum,
  UserManagementMessagePatternEnum,
  MicroServicesEnum,
  WithSessionsEnums,
} from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RefreshGuard implements CanActivate {
  logger: LoggerService;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(MicroServicesEnum.USERMANAGEMENT_MS) private userClient: ClientProxy,
  ) {
    this.logger = new Logger(RefreshGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: HttpRequest = context.switchToHttp().getRequest();
    const refreshToken = request.cookies[TokenTypeEnum.refreshToken];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    const { id } = this.jwtService.verifyRefresh(refreshToken);

    request.user = await lastValueFrom(
      this.userClient.send(UserManagementMessagePatternEnum.findUserById, {
        id,
        withSessions: WithSessionsEnums.Active,
      }),
    );

    if (request.user) {
      const currentSession = request.user.sessions.find(
        (session) => session.ipAddress === request.ip && session.refreshToken === refreshToken,
      );
      if (currentSession) {
        request.user.currentSessionId = currentSession.id;
      } else {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
}
