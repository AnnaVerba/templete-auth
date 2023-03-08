import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { UserRole } from '../../models';

@Injectable()
export class UserRoleRepository extends AbstractService<UserRole> {
  constructor(@InjectModel(UserRole) private readonly userRoleModel: Repository<UserRole>) {
    super(userRoleModel);
  }
}
