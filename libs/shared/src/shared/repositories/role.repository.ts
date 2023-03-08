import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { Role } from '../../models';

@Injectable()
export class RoleRepository extends AbstractService<Role> {
  constructor(@InjectModel(Role) private readonly roleModel: Repository<Role>) {
    super(roleModel);
  }
}
