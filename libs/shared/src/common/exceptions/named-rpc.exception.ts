import { RpcException } from '@nestjs/microservices';

export default class NamedRpcException extends RpcException {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}
