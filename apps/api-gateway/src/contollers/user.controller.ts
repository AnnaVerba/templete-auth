import {
  MicroServicesEnum,
  UserManagementMessagePatternEnum,
  User,
  UserResponse,
  CoreResponse,
  UserSession,
  UserProfileUpdateDto,
  UserSessionResponse,
  UserProvider,
  UserProviderResponse,
  UserRoleCreateDto,
  UserRole,
  UserRoleResponse,
  BadRequestExceptionResponse,
  UserUpdateDto,
  FindOneQueryDto,
  FindAllQueryDto,
  apiOkResponsePaginated,
  PaginatedAllResponse,
} from '@app/shared';
import { Controller, Inject, Get, Body, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(MicroServicesEnum.USERMANAGEMENT_MS)
    private readonly userService: ClientProxy,
  ) {}

  @ApiOperation({ summary: '[GetAllUsers]', description: 'Get all users' })
  @apiOkResponsePaginated(UserResponse, 'Successfully')
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'One of the query params are of the wrong type',
  })
  @Get()
  async findAll(@Query() query?: FindAllQueryDto): Promise<PaginatedAllResponse<UserResponse>> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.findAllUsers, query));
  }

  @ApiOperation({ summary: '[GetUser]', description: 'Got user' })
  @ApiOkResponse({ type: UserResponse, description: 'Got successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'User not found' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'One of the arguments is of the wrong type',
  })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Query() query?: FindOneQueryDto): Promise<User> {
    return lastValueFrom(
      this.userService.send(UserManagementMessagePatternEnum.findUserById, {
        id,
        ...query,
      }),
    );
  }

  @ApiOperation({ summary: '[EditUser]', description: 'Edit user' })
  @ApiOkResponse({ type: UserResponse, description: 'Updated successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'User not found' })
  @ApiBadRequestResponse({
    type: CoreResponse,
    description: 'One of the arguments is of the wrong type',
  })
  @Patch()
  async updateUser(@Body() body: UserUpdateDto): Promise<User> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.updateUser, body));
  }

  @ApiOperation({ summary: '[EditUserProfile]', description: "Edit user's profile" })
  @ApiOkResponse({ type: UserResponse, description: 'Updated successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'User not found' })
  @ApiBadRequestResponse({
    type: CoreResponse,
    description: 'One of the arguments is of the wrong type',
  })
  @Patch('profile')
  async updateUserProfile(@Body() body: UserProfileUpdateDto): Promise<User> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.updateUserProfile, body));
  }

  @ApiOperation({ summary: '[GetUserSession]', description: "Get user's session" })
  @ApiOkResponse({ type: UserSessionResponse, description: 'Got successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Session not found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Session's id",
    required: true,
  })
  @Get('sessions/:id')
  async findOneUserSession(@Param('id', ParseUUIDPipe) id: string): Promise<UserSession> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.findSession, { id }));
  }

  @ApiOperation({ summary: '[GetAllUserSessions]', description: "Get all user's sessions" })
  @ApiOkResponse({ type: UserSessionResponse, isArray: true, description: 'Got successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'User not found' })
  @ApiQuery({
    name: 'userId',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "User's id",
    required: true,
  })
  @ApiQuery({
    name: 'withSessions',
    type: String,
    example: 'active',
    description: 'Adding sessions option. active - only active sessions. Leave empty to see all sessions',
    required: false,
  })
  @Get('sessions')
  async findAllUserSessions(
    @Query('userId', ParseUUIDPipe) id: string,
    @Query('withSessions') withSessions?: string,
  ): Promise<UserSession[]> {
    return lastValueFrom(
      this.userService.send(UserManagementMessagePatternEnum.findAllUserSessions, {
        id,
        withSessions,
      }),
    );
  }

  @ApiOperation({ summary: '[GetUserProvider]', description: "Get user's provider" })
  @ApiOkResponse({ type: UserProviderResponse, description: 'Got successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Provider not found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Provider's id",
    required: true,
  })
  @Get('providers/:id')
  async findOneUserProvider(@Param('id', ParseUUIDPipe) id: string): Promise<UserProvider> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.findProvider, { id }));
  }

  @ApiOperation({ summary: '[LinkingUserToRole]', description: 'Linking user to role' })
  @ApiCreatedResponse({ type: UserRoleResponse, description: 'Linked successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'User or role not found' })
  @ApiConflictResponse({ type: CoreResponse, description: 'Already linked' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'UserId or RoleId is not a UUID',
  })
  @Post('link')
  async addRoleToUser(@Body() body: UserRoleCreateDto): Promise<UserRole> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.addRoleToUser, body));
  }

  @ApiOperation({
    summary: '[UnlinkingUserFromRole]',
    description: 'Unlinking user from role',
  })
  @ApiCreatedResponse({
    type: Number,
    schema: { example: 1 },
    description: 'Amount of deleted records',
  })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Not linked' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'UserId or RoleId is not a UUID',
  })
  @Post('unlink')
  async removeRoleFromUser(@Body() body: UserRoleCreateDto): Promise<number> {
    return lastValueFrom(this.userService.send(UserManagementMessagePatternEnum.removeRoleFromUser, body));
  }
}
