import { Controller } from '@nestjs/common';
import { UserService } from '../services';
import { MessagePattern } from '@nestjs/microservices';
import {
  UserCreateDto,
  UserProfileUpdateDto,
  UserProviderCreateDto,
  UserSessionCreateDto,
  User,
  UserManagementMessagePatternEnum,
  UserSession,
  UserProvider,
  UserSessionFindDto,
  UserSessionUpdateDto,
  UserProviderFindDto,
  UserProviderUpdateDto,
  UserFindDto,
  UserResponse,
  UserUpdateDto,
  FindAllQueryDto,
  PaginatedAllResponse,
} from '@app/shared';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern(UserManagementMessagePatternEnum.findAllUsers)
  async findAll(filterOptions: FindAllQueryDto): Promise<PaginatedAllResponse<UserResponse>> {
    return this.userService.findAll(filterOptions);
  }

  @MessagePattern(UserManagementMessagePatternEnum.createNewUser)
  async create(data: UserCreateDto): Promise<User> {
    return this.userService.create(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findUserById)
  async findOneById(data: UserFindDto): Promise<User> {
    return this.userService.findOne(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findUserByEmail)
  async findOneByEmail(data: { email: string }): Promise<User> {
    return this.userService.findOneByEmail(data.email);
  }

  @MessagePattern(UserManagementMessagePatternEnum.updateUser)
  async updateUser(data: UserUpdateDto): Promise<User> {
    return this.userService.updateUser(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.deleteUser)
  async deleteUser(data: UserFindDto): Promise<number> {
    return this.userService.deleteUser(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.updateUserProfile)
  async updateUserProfile(data: UserProfileUpdateDto): Promise<User> {
    return this.userService.updateUserProfile(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.addSession)
  async addSession(data: UserSessionCreateDto): Promise<UserSession> {
    return this.userService.addSession(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findSession)
  async findSession(data: UserSessionFindDto): Promise<UserSession> {
    return this.userService.findSession(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findAllUserSessions)
  async findAllUserSessions(data: UserFindDto): Promise<UserSession[]> {
    return this.userService.findAllUserSessions(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.expireSession)
  async expireSession(data: UserSessionFindDto): Promise<UserSession> {
    return this.userService.expireSession(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.updateSession)
  async updateSession(data: UserSessionUpdateDto): Promise<UserSession> {
    return this.userService.updateSession(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.addProvider)
  async addProvider(data: UserProviderCreateDto): Promise<UserProvider> {
    return this.userService.addProvider(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findProvider)
  async findProvider(data: UserProviderFindDto): Promise<UserProvider> {
    return this.userService.findProvider(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.findProviderByUser)
  async findProviderByUserData(data: UserProviderFindDto): Promise<UserProvider> {
    return this.userService.findProviderByUser(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.updateProvider)
  async updateProvider(data: UserProviderUpdateDto): Promise<UserProvider> {
    return this.userService.updateProvider(data);
  }

  @MessagePattern(UserManagementMessagePatternEnum.deleteProvider)
  async deleteProvider(data: UserProviderFindDto): Promise<number> {
    return this.userService.deleteProvider(data);
  }
}
