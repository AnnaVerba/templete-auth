import {
  BadRequestExceptionResponse,
  CoreResponse,
  MicroServicesEnum,
  Permission,
  PermissionCreateDto,
  PermissionResponse,
  PermissionUpdateDto,
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

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(@Inject(MicroServicesEnum.USERMANAGEMENT_MS) private readonly permissionService: ClientProxy) {}

  @ApiOperation({ summary: '[GetAllPermissions]', description: 'Get all permissions' })
  @ApiOkResponse({
    type: PermissionResponse,
    isArray: true,
    description: 'Returns all permissions',
  })
  @Get()
  async findAll(): Promise<Permission[]> {
    return lastValueFrom(this.permissionService.send(UserManagementMessagePatternEnum.findAllPermissions, ''));
  }

  @ApiOperation({ summary: '[CreatePermission]', description: 'Create new permission' })
  @ApiCreatedResponse({ type: PermissionResponse, description: 'Created successfully' })
  @ApiConflictResponse({ type: CoreResponse, description: 'Permission already exists' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'Name is not a string',
  })
  @Post()
  async create(@Body() body: PermissionCreateDto): Promise<Permission> {
    return lastValueFrom(this.permissionService.send(UserManagementMessagePatternEnum.createPermission, body));
  }

  @ApiOperation({ summary: '[GetPermission]', description: 'Get permission' })
  @ApiOkResponse({ type: PermissionResponse, description: 'Got successfully' })
  @ApiNotFoundResponse({
    type: CoreResponse,
    description: 'Permission not found',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Permission's id",
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return lastValueFrom(this.permissionService.send(UserManagementMessagePatternEnum.findPermissionById, { id }));
  }

  @ApiOperation({ summary: '[EditPermission]', description: 'Edit permission' })
  @ApiOkResponse({ type: PermissionResponse, description: 'Udpated successfully' })
  @ApiNotFoundResponse({
    type: CoreResponse,
    description: 'Permission not found',
  })
  @ApiConflictResponse({ type: CoreResponse, description: 'Name is already exists' })
  @ApiBadRequestResponse({
    type: BadRequestExceptionResponse,
    description: 'Name is not a string',
  })
  @Patch()
  async update(@Body() body: PermissionUpdateDto): Promise<Permission> {
    return lastValueFrom(this.permissionService.send(UserManagementMessagePatternEnum.updatePermission, body));
  }

  @ApiOperation({ summary: '[DeletePermission]', description: 'Delete permission' })
  @ApiOkResponse({
    type: Number,
    schema: { example: 1 },
    description: 'Amount of deleted records',
  })
  @ApiNotFoundResponse({
    type: CoreResponse,
    description: 'Permission not found',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'aef9fdbc-b4b6-4beb-9326-9b4f1773b0ba',
    description: "Permission's id",
    required: true,
  })
  @Delete(':id')
  async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
    return lastValueFrom(this.permissionService.send(UserManagementMessagePatternEnum.deletePermission, { id }));
  }
}
