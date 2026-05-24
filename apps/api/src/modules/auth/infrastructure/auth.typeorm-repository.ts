import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { AuthRepositoryPort, AuthUserRecord } from '../../auth/domain/auth.repository.port';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import { permissionsCacheKey } from '../../../common/cache/cache-keys';

@Injectable()
export class AuthTypeOrmRepository implements AuthRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user ? this.toRecord(user) : null;
  }

  async findById(userId: string): Promise<Omit<AuthUserRecord, 'passwordHash' | 'isActive'> | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, fullName: user.fullName };
  }

  async getPermissionsForUser(userId: string): Promise<string[]> {
    const cacheKey = permissionsCacheKey(userId);
    const cached = await this.cache.get<string[]>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return [];

    const permissions = new Set<string>();
    for (const role of user.roles) {
      for (const perm of role.permissions) {
        permissions.add(perm.key);
      }
    }
    const result = Array.from(permissions);
    await this.cache.set(cacheKey, result, 900000);
    return result;
  }

  private toRecord(user: UserOrmEntity): AuthUserRecord {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
    };
  }
}
