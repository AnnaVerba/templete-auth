import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../database';
import {
  AuthSession,
  Permission,
  Role,
  RolePermission,
  User,
  UserProfile,
  UserProvider,
  UserSession,
  UserRole,
} from '../models';
import {
  AuthSessionRepository,
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserProfileRepository,
  UserProviderRepository,
  UserSessionRepository,
  UserRepository,
  UserRoleRepository,
} from './repositories';

const providers = [
  AuthSessionRepository,
  UserRepository,
  PermissionRepository,
  RoleRepository,
  RolePermissionRepository,
  UserProfileRepository,
  UserProviderRepository,
  UserSessionRepository,
  UserRoleRepository,
];

const models = [User, AuthSession, Permission, Role, RolePermission, UserProfile, UserProvider, UserSession, UserRole];

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature(models)],
  providers,
  exports: [...providers],
})
export class SharedModule {}
