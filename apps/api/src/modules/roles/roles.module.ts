import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionOrmEntity } from '../roles/infrastructure/permission.orm-entity';
import { RoleOrmEntity } from '../roles/infrastructure/role.orm-entity';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { RolesController } from './presentation/roles.controller';
import { RolesService } from './application/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleOrmEntity, PermissionOrmEntity, UserOrmEntity])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
