import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity } from '../roles/infrastructure/role.orm-entity';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
