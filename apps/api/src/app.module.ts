import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingModule } from './common/logging/logging.module';
import { CacheConfigModule } from './common/cache/cache.module';
import { GlobalExceptionFilter } from './common/security/global-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { InsightsModule } from './modules/insights/insights.module';
import { BootstrapSeeder } from './database/seeders/bootstrap.seeder';
import { PermissionOrmEntity } from './modules/roles/infrastructure/permission.orm-entity';
import { RoleOrmEntity } from './modules/roles/infrastructure/role.orm-entity';
import { UserOrmEntity } from './modules/users/infrastructure/user.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggingModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([PermissionOrmEntity, RoleOrmEntity, UserOrmEntity]),
    CacheConfigModule,
    AuthModule,
    UsersModule,
    RolesModule,
    EmployeesModule,
    InsightsModule,
  ],
  providers: [
    BootstrapSeeder,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
