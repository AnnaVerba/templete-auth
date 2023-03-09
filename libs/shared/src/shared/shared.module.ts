import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../database';
import { AuthSession, User, UserProfile, UserProvider, UserSession } from '../models';
import {
  AuthSessionRepository,
  UserProfileRepository,
  UserProviderRepository,
  UserSessionRepository,
  UserRepository,
} from './repositories';

const providers = [
  AuthSessionRepository,
  UserRepository,
  UserProfileRepository,
  UserProviderRepository,
  UserSessionRepository,
];

const models = [User, AuthSession, UserProfile, UserProvider, UserSession];

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature(models)],
  providers,
  exports: [...providers],
})
export class SharedModule {}
