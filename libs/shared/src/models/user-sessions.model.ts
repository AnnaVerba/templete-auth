import {
  Table,
  Model,
  Default,
  DataType,
  IsUUID,
  PrimaryKey,
  Column,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  Unique,
  AllowNull,
} from 'sequelize-typescript';
import { User } from '.';

@Table({ tableName: 'userSessions' })
export class UserSession extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => User)
  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @Column({ field: 'ip_address' })
  ipAddress: string;

  @Column({ field: 'os_info' })
  osInfo: string;

  @Default(true)
  @AllowNull(false)
  @Column({ field: 'is_active' })
  isActive: boolean;

  @Unique
  @AllowNull(true)
  @Column({ field: 'refresh_token' })
  refreshToken: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'expired_at' })
  expiredAt: Date;
}
