import {
  Model,
  Table,
  Default,
  DataType,
  IsUUID,
  PrimaryKey,
  Column,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import { Permission, RolePermission, User, UserRole } from '.';

@Table({ tableName: 'roles' })
export class Role extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Unique
  @Column
  name: string;

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
