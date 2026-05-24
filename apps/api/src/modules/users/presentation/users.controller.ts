import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS, PermissionKey } from '@sms/shared';
import { RbacGuard } from '../../../common/security/rbac.guard';
import { RequirePermissions } from '../../../common/security/require-permissions.decorator';
import { UsersService } from '../application/users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@RequirePermissions(PERMISSIONS.USERS_MANAGE as PermissionKey)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: { email: string; password: string; fullName: string; roleIds: string[] },
  ) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: { fullName?: string; isActive?: boolean; roleIds?: string[]; password?: string },
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }
}
