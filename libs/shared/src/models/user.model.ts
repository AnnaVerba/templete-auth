import {
  Model,
  Table,
  Default,
  IsUUID,
  PrimaryKey,
  Column,
  DataType,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsToMany,
  HasOne,
  AllowNull,
} from 'sequelize-typescript';
import { Role, UserProfile, UserProvider, UserSession, UserRole } from '.';

@Table({ tableName: 'users' })
export class User extends Model {
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Unique
  @Column
  email: string;

  @AllowNull(true)
  @Column
  password: string;

  @Default(false)
  @Column({ field: 'is_verified' })
  isVerified: boolean;

  @Default(false)
  @Column({ field: 'is_banned' })
  isBanned: boolean;

  @HasOne(() => UserProfile)
  profile: UserProfile;

  @HasMany(() => UserProvider)
  providers: UserProvider[];

  @HasMany(() => UserSession)
  sessions: UserSession[];

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
