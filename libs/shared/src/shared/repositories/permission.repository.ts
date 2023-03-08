import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { Permission } from '../../models';

@Injectable()
export class PermissionRepository extends AbstractService<Permission> {
  constructor(@InjectModel(Permission) private readonly permissionModel: Repository<Permission>) {
    super(permissionModel);
  }
}
