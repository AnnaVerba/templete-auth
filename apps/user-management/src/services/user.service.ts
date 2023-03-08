import { Injectable } from '@nestjs/common';
import {
  UserCreateDto,
  UserProfileUpdateDto,
  UserProviderCreateDto,
  UserSessionCreateDto,
  BcryptService,
  User,
  UserRole,
  UserProfile,
  UserProvider,
  UserSession,
  UserRepository,
  UserSessionRepository,
  UserProfileRepository,
  UserProviderRepository,
  UserRoleRepository,
  UserSessionFindDto,
  UserSessionUpdateDto,
  UserProviderFindDto,
  UserProviderUpdateDto,
  UserFindDto,
  UserRoleCreateDto,
  RoleRepository,
  UserUpdateDto,
  WithSessionsEnums,
  FindAllQueryDto,
  UserResponse,
  PaginatedAllResponse,
  Role,
} from '@app/shared';
import { IncludeOptions } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userProviderRepository: UserProviderRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(data: UserCreateDto): Promise<User> {
    const { email, password, ...profile } = data;
    await this.userRepository.throwIfExist({ where: { email } });
    const body = { email, profile };
    if (password) {
      body['password'] = await this.bcryptService.hash(password);
    }
    return this.userRepository.create(body, { include: [UserProfile] });
  }

  async findAll(filterOptions: FindAllQueryDto): Promise<PaginatedAllResponse<UserResponse>> {
    return this.userRepository.findAllWithFilter(filterOptions);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(data: UserFindDto): Promise<User> {
    const { id, email, withSessions } = data;
    const include: IncludeOptions[] = [
      { model: UserProfile, attributes: { exclude: ['userId'] } },
      { model: UserProvider, attributes: { exclude: ['userId'] } },
      { model: Role, through: { attributes: [] }, attributes: ['id', 'name'] },
    ];
    if (withSessions === WithSessionsEnums.Active) {
      include.push({
        model: UserSession,
        where: { isActive: true },
        attributes: { exclude: ['userId'] },
      });
    } else if (withSessions === WithSessionsEnums.All) {
      include.push({ model: UserSession, attributes: { exclude: ['userId'] } });
    }
    const findOptions = id ? { id } : email ? { email } : {};
    const result = await this.userRepository.findOne({
      where: findOptions,
      include,
    });
    return result
      ? result
      : this.userRepository.throwIfNotExist({
          where: findOptions,
        });
  }

  async updateUser(data: UserUpdateDto): Promise<User> {
    if (data.password) {
      data.password = await this.bcryptService.hash(data.password);
    }
    const { id, ...body } = data;
    await this.userRepository.throwIfNotExist({ where: { id } });
    await this.userRepository.update(body, { where: { id } });
    return this.findOne({ id });
  }

  async deleteUser(data: UserFindDto): Promise<number> {
    const { id } = data;
    return this.userRepository.destroy({ where: { id } });
  }

  async updateUserProfile(data: UserProfileUpdateDto): Promise<User> {
    const { id, ...body } = data;
    const user = await this.userRepository.throwIfNotExist({ where: { id } });
    await this.userProfileRepository.update(body, { where: { userId: id } });
    return await this.findOne({ id: user.id });
  }

  async addSession(data: UserSessionCreateDto): Promise<UserSession> {
    const { userId, ...body } = data;

    await this.userRepository.throwIfNotExist({ where: { id: userId } });

    const user = await this.findOne({ id: userId, withSessions: WithSessionsEnums.Active });
    const oldSessions = await this.findAllUserSessions({ id: userId });
    const session: UserSession = await user.$create('session', { ...body });
    await user.$set('sessions', [...oldSessions, session]);

    return session;
  }

  async findSession(data: UserSessionFindDto): Promise<UserSession> {
    const { id } = data;
    return this.userSessionRepository.throwIfNotExist({ where: { id } });
  }

  async findAllUserSessions(data: UserFindDto): Promise<UserSession[]> {
    const { id, withSessions } = data;
    const where = { userId: id };
    if (withSessions === WithSessionsEnums.Active) {
      where['isActive'] = true;
    }
    return this.userSessionRepository.findAll({ where });
  }

  async expireSession(data: UserSessionFindDto): Promise<UserSession> {
    const { id } = data;
    await this.userSessionRepository.throwIfNotExist({ where: { id } });
    await this.userSessionRepository.update(
      { expiredAt: new Date(), isActive: false, refreshToken: null },
      { where: { id } },
    );
    return this.findSession({ id });
  }

  async updateSession(data: UserSessionUpdateDto): Promise<UserSession> {
    const { id, ...body } = data;
    await this.userSessionRepository.throwIfNotExist({ where: { id } });
    await this.userSessionRepository.update(body, { where: { id } });
    return this.findSession({ id });
  }

  async deleteSession(data: UserSessionFindDto): Promise<number> {
    const { id } = data;
    return this.userSessionRepository.destroy({ where: { id } });
  }

  async addProvider(data: UserProviderCreateDto): Promise<UserProvider> {
    const { userId, ...body } = data;
    const user = await this.findOne({ id: userId });
    const provider: UserProvider = await user.$create('provider', { ...body });
    await user.$set('providers', [...user.providers, provider]);
    return provider;
  }

  async findProvider(data: UserProviderFindDto): Promise<UserProvider> {
    const { id } = data;
    return this.userProviderRepository.throwIfNotExist({ where: { id } });
  }

  async findProviderByUser(data: UserProviderFindDto): Promise<UserProvider> {
    return this.userProviderRepository.findOne({ where: { userId: data.userId } });
  }

  async updateProvider(data: UserProviderUpdateDto): Promise<UserProvider> {
    const { id, ...body } = data;
    await this.userProviderRepository.update(body, { where: { id } });
    return this.findProvider({ id });
  }

  async deleteProvider(data: UserProviderFindDto): Promise<number> {
    const { id } = data;
    return this.userProviderRepository.destroy({ where: { id } });
  }

  async addRoleToUser(data: UserRoleCreateDto): Promise<UserRole> {
    const { userId, roleId } = data;
    await this.userRepository.throwIfNotExist({ where: { id: userId } });
    await this.roleRepository.throwIfNotExist({ where: { id: roleId } });
    await this.userRoleRepository.throwIfExist({ where: { userId, roleId } });
    return this.userRoleRepository.create({ userId, roleId });
  }

  async removeRoleFromUser(data: UserRoleCreateDto): Promise<number> {
    const { userId, roleId } = data;
    await this.userRoleRepository.throwIfNotExist({ where: { userId, roleId } });
    return this.userRoleRepository.destroy({ where: { userId, roleId } });
  }
}
