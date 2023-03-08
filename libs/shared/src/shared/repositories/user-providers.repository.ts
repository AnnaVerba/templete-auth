import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { UserProvider } from '../../models';

@Injectable()
export class UserProviderRepository extends AbstractService<UserProvider> {
  constructor(@InjectModel(UserProvider) private readonly userProviderModel: Repository<UserProvider>) {
    super(userProviderModel);
  }
}
