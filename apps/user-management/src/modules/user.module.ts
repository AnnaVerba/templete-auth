import { Module } from '@nestjs/common';
import { UserService } from '../services';
import { UserController } from '../controllers';
import { BcryptService, SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  providers: [UserService, BcryptService],
  controllers: [UserController],
})
export class UserModule {}
