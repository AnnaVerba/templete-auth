import { ForeignKey, Model, Table, IsUUID, Column, DataType } from 'sequelize-typescript';
import { Role, Permission } from '.';

@Table({ tableName: 'rolesPermissions' })
export class RolePermission extends Model {
  @ForeignKey(() => Role)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'role_id' })
  roleId: string;

  @ForeignKey(() => Permission)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'permisssion_id' })
  permissionId: string;
}
