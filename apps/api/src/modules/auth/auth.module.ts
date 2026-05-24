import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_REPOSITORY } from '../../common/tokens';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { AuthTypeOrmRepository } from './infrastructure/auth.typeorm-repository';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { LoginUseCase } from './application/login.use-case';
import { GetMeUseCase } from './application/get-me.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    GetMeUseCase,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthTypeOrmRepository,
    },
  ],
  exports: [JwtModule, PassportModule, AUTH_REPOSITORY],
})
export class AuthModule {}
