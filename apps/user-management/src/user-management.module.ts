import { Module } from '@nestjs/common';
import { UserModule } from './modules';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule, UserModule],
})
export class UserManagementModule {}
