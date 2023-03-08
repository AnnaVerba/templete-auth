import { RpcExceptionFilter, Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import NamedRpcException from '../exceptions/named-rpc.exception';

@Catch()
export class ToRpcExceptionConverter implements RpcExceptionFilter<RpcException> {
  catch(exception: any): Observable<any> {
    return exception instanceof RpcException || exception instanceof NamedRpcException
      ? throwError(() => exception)
      : throwError(() => new RpcException({ name: exception.name, message: exception.message }).getError());
  }
}
