import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ALL_PERMISSIONS } from '@sms/shared';
import { RoleOrmEntity } from '../infrastructure/role.orm-entity';
import { PermissionOrmEntity } from '../infrastructure/permission.orm-entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleOrmEntity) private readonly roleRepo: Repository<RoleOrmEntity>,
    @InjectRepository(PermissionOrmEntity) private readonly permRepo: Repository<PermissionOrmEntity>,
  ) {}

  findAll() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: { name: string; description?: string; permissions: string[] }) {
    const permissions = await this.loadPermissions(data.permissions);
    const role = this.roleRepo.create({
      name: data.name,
      description: data.description ?? null,
      isSystem: false,
      permissions,
    });
    return this.roleRepo.save(role);
  }

  async update(id: string, data: { name?: string; description?: string; permissions?: string[] }) {
    const role = await this.findOne(id);
    this.assertCanRename(role, data.name);
    this.applyRoleFields(role, data);
    if (data.permissions) {
      role.permissions = await this.loadPermissions(data.permissions);
    }
    return this.roleRepo.save(role);
  }

  async delete(id: string) {
    const role = await this.findOne(id);
    if (role.isSystem) throw new Error('Cannot delete system role');
    await this.roleRepo.delete(id);
  }

  listPermissions() {
    return ALL_PERMISSIONS;
  }

  private async loadPermissions(keys: string[]) {
    return this.permRepo.createQueryBuilder('p').where('p.key IN (:...keys)', { keys }).getMany();
  }

  private assertCanRename(role: RoleOrmEntity, name?: string) {
    if (role.isSystem && name && name !== role.name) {
      throw new Error('Cannot rename system role');
    }
  }

  private applyRoleFields(
    role: RoleOrmEntity,
    data: { name?: string; description?: string },
  ) {
    if (data.name) role.name = data.name;
    if (data.description !== undefined) role.description = data.description;
  }
}
