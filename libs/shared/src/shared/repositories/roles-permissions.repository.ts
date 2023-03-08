import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AbstractService } from '../../common';
import { RolePermission } from '../../models';

@Injectable()
export class RolePermissionRepository extends AbstractService<RolePermission> {
  constructor(@InjectModel(RolePermission) private readonly rolePermissionModel: Repository<RolePermission>) {
    super(rolePermissionModel);
  }
}
