import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthRepositoryPort } from '../domain/auth.repository.port';
import { LoginResult } from '../domain/auth.types';
import { AUTH_REPOSITORY } from '../../../common/tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepositoryPort,
    private readonly jwtService: JwtService,
    @InjectPinoLogger(LoginUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    const user = await this.authRepo.findByEmail(email);
    if (!user?.isActive) {
      this.logger.warn({ email, action: 'auth.login.failed' }, 'Login failed');
      throw new UnauthorizedException('Invalid credentials');
    }
    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      this.logger.warn({ email, action: 'auth.login.failed' }, 'Login failed');
      throw new UnauthorizedException('Invalid credentials');
    }
    const permissions = await this.authRepo.getPermissionsForUser(user.id);
    const payload = { sub: user.id, email: user.email, permissions };
    const accessToken = this.jwtService.sign(payload);
    this.logger.info({ userId: user.id, action: 'auth.login.success' }, 'Login success');
    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, permissions },
    };
  }
}
