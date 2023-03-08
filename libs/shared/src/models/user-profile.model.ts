import {
  Table,
  Model,
  Default,
  DataType,
  IsUUID,
  PrimaryKey,
  Column,
  AllowNull,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '.';

@Table({ tableName: 'userProfiles' })
export class UserProfile extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => User)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @Column({ field: 'first_name' })
  firstName: string;

  @Column({ field: 'last_name' })
  lastName: string;

  @AllowNull(true)
  @Column
  phone: string;

  @AllowNull(true)
  @Column
  avatar: string;

  @CreatedAt
  @Column({ field: 'createdAt' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  updatedAt: Date;
}
