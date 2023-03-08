import {
  Table,
  Default,
  DataType,
  IsUUID,
  PrimaryKey,
  Column,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  Model,
} from 'sequelize-typescript';
import { User } from '.';

@Table({ tableName: 'userProviders' })
export class UserProvider extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => User)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @Column
  name: string;

  @Column
  key: string;

  @CreatedAt
  @Column({ field: 'createdAt' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  updatedAt: Date;
}
