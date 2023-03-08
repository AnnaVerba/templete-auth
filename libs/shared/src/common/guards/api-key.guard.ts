import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const valueFromController = this.reflector.get('test', context.getHandler());
    // TODO: check if we need this.
    // if (publicKey) return true;
    //
    // const request = context.switchToHttp().getRequest<Request>();
    // const apiKey = request.header('Authorization');
    //
    // return apiKey === this.configService.get('API_KEY');
    return true;
  }
}
