import {
  Model,
  Table,
  IsUUID,
  PrimaryKey,
  Column,
  DataType,
  Default,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import { Role, RolePermission } from '.';

@Table({ tableName: 'permissions' })
export class Permission extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Unique
  @Column
  name: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];
}
