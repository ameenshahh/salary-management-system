import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthRepositoryPort } from '../domain/auth.repository.port';
import { AuthUser } from '../domain/auth.types';
import { AUTH_REPOSITORY } from '../../../common/tokens';

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepositoryPort) {}

  async execute(userId: string): Promise<AuthUser> {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const permissions = await this.authRepo.getPermissionsForUser(userId);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      permissions,
    };
  }
}
