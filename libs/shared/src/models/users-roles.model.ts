import { Model, Table, ForeignKey, IsUUID, Column, DataType } from 'sequelize-typescript';
import { User, Role } from '.';

@Table({ tableName: 'usersRoles' })
export class UserRole extends Model {
  @ForeignKey(() => User)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Role)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'role_id' })
  roleId: string;
}
