import {
  BadRequestExceptionResponse,
  CoreResponse,
  MicroServicesEnum,
  Role,
  RoleCreateDto,
  RolePermission,
  RolePermissionResponse,
  RoleResponse,
  RolesPermissionCreateDto,
  RoleUpdateDto,
  UserManagementMessagePatternEnum,
} from '@app/shared';
import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    @Inject(MicroServicesEnum.USERMANAGEMENT_MS)
    private readonly roleService: ClientProxy,
  ) {}

  @ApiOperation({ summary: '[GetAllRoles]', description: 'Gets all roles' })
  @ApiOkResponse({ type: RoleResponse, isArray: true, description: 'Returns all roles' })
  @Get()
  async findAll(): Promise<Role[]> {
    return lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.findAllRoles, ''));
  }

  @ApiOperation({ summary: '[CreateRole]', description: 'Create new role' })
  @ApiCreatedResponse({ type: RoleResponse, description: 'Created successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Permission not found' })
  @ApiConflictResponse({ type: CoreResponse, description: 'Role already exists' })
  @ApiBadRequestResponse({ type: BadRequestExceptionResponse, description: 'Name is not a string' })
  @Post()
  async create(@Body() body: RoleCreateDto): Promise<Role> {
    return lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.createRole, body));
  }

  @ApiOperation({ summary: '[GetRole]', description: 'Get role' })
  @ApiOkResponse({ type: RoleResponse, description: 'Got successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Role not found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Role's id",
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.findRoleById, { id }));
  }

  @ApiOperation({ summary: '[EditRole]', description: 'Edit role' })
  @ApiOkResponse({ type: RoleResponse })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Role not found' })
  @ApiConflictResponse({ type: CoreResponse, description: 'Name is already exists' })
  @ApiBadRequestResponse({ type: BadRequestExceptionResponse, description: 'Name is not a string' })
  @Patch()
  async update(@Body() body: RoleUpdateDto): Promise<Role> {
    return lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.updateRole, body));
  }

  @ApiOperation({ summary: '[DeleteRole]', description: 'Delete role' })
  @ApiOkResponse({ type: Number, schema: { example: 1 }, description: 'Amount of deleted records' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Role not found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Role's id",
    required: true,
  })
  @Delete(':id')
  async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
    return lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.deleteRole, { id }));
  }

  @ApiOperation({ summary: '[LinkingRoleToPermission]', description: 'Linking role to permission' })
  @ApiCreatedResponse({ type: RolePermissionResponse, description: 'Linked successfully' })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Role or permission not found' })
  @ApiConflictResponse({ type: CoreResponse, description: 'Already linked' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'RoleId or PermissionId is not a UUID',
  })
  @Post('link')
  async addPermissionToRole(@Body() body: RolesPermissionCreateDto): Promise<RolePermission> {
    return await lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.addPermissionToRole, body));
  }

  @ApiOperation({
    summary: '[UnlinkingRoleFromPermission]',
    description: 'Unlinking role from permission',
  })
  @ApiCreatedResponse({
    type: Number,
    schema: { example: 1 },
    description: 'Amount of deleted records',
  })
  @ApiNotFoundResponse({ type: CoreResponse, description: 'Not linked' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'RoleId or PermissionId is not a UUID',
  })
  @Post('unlink')
  async removePermissionToRole(@Body() body: RolesPermissionCreateDto): Promise<number> {
    return await lastValueFrom(this.roleService.send(UserManagementMessagePatternEnum.removePermissionFromRole, body));
  }
}
