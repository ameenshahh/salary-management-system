import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ALL_PERMISSIONS, DEFAULT_ROLES } from '@sms/shared';
import { PermissionOrmEntity } from '../../modules/roles/infrastructure/permission.orm-entity';
import { RoleOrmEntity } from '../../modules/roles/infrastructure/role.orm-entity';
import { UserOrmEntity } from '../../modules/users/infrastructure/user.orm-entity';

@Injectable()
export class BootstrapSeeder {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly permRepo: Repository<PermissionOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectPinoLogger(BootstrapSeeder.name)
    private readonly logger: PinoLogger,
  ) {}

  async run(): Promise<void> {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedAdmin();
    this.logger.info({ action: 'bootstrap.seed.complete' }, 'Bootstrap seed complete');
  }

  private async seedPermissions(): Promise<void> {
    for (const key of ALL_PERMISSIONS) {
      const existing = await this.permRepo.findOne({ where: { key } });
      if (!existing) {
        await this.permRepo.save(this.permRepo.create({ key }));
      }
    }
  }

  private async seedRoles(): Promise<void> {
    for (const roleDef of Object.values(DEFAULT_ROLES)) {
      let role = await this.roleRepo.findOne({ where: { name: roleDef.name } });
      if (!role) {
        role = await this.roleRepo.save(
          this.roleRepo.create({
            name: roleDef.name,
            description: roleDef.description,
            isSystem: roleDef.isSystem,
          }),
        );
      }
      const permissions = await this.permRepo
        .createQueryBuilder('p')
        .where('p.key IN (:...keys)', { keys: roleDef.permissions })
        .getMany();
      role.permissions = permissions;
      await this.roleRepo.save(role);
    }
  }

  private async seedAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL ?? 'admin@company.local';
    const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123456!';
    let user = await this.userRepo.findOne({ where: { email } });
    if (user) return;

    const adminRole = await this.roleRepo.findOneOrFail({ where: { name: 'admin' } });
    const hash = await bcrypt.hash(password, 12);
    user = this.userRepo.create({
      email,
      passwordHash: hash,
      fullName: 'System Admin',
      isActive: true,
      roles: [adminRole],
    });
    await this.userRepo.save(user);
    this.logger.info({ email, action: 'bootstrap.admin.created' }, 'Admin user created');
  }
}
