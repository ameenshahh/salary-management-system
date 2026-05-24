import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS, PermissionKey } from '@sms/shared';
import { RbacGuard } from '../../../common/security/rbac.guard';
import { RequirePermissions } from '../../../common/security/require-permissions.decorator';
import { RolesService } from '../application/roles.service';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@RequirePermissions(PERMISSIONS.ROLES_MANAGE as PermissionKey)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  listPermissions() {
    return this.rolesService.listPermissions();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; description?: string; permissions: string[] }) {
    return this.rolesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { name?: string; description?: string; permissions?: string[] },
  ) {
    return this.rolesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.delete(id);
  }
}
