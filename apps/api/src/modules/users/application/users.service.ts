import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserOrmEntity } from '../infrastructure/user.orm-entity';
import { RoleOrmEntity } from '../../roles/infrastructure/role.orm-entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserOrmEntity) private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity) private readonly roleRepo: Repository<RoleOrmEntity>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['roles'] });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    roleIds: string[];
  }) {
    const hash = await bcrypt.hash(data.password, 12);
    const roles = await this.roleRepo.find({ where: { id: In(data.roleIds) } });
    const user = this.userRepo.create({
      email: data.email,
      passwordHash: hash,
      fullName: data.fullName,
      isActive: true,
      roles,
    });
    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async update(
    id: string,
    data: { fullName?: string; isActive?: boolean; roleIds?: string[]; password?: string },
  ) {
    const user = await this.userRepo.findOneOrFail({ where: { id }, relations: ['roles'] });
    if (data.fullName) user.fullName = data.fullName;
    if (data.isActive !== undefined) user.isActive = data.isActive;
    if (data.password) user.passwordHash = await bcrypt.hash(data.password, 12);
    if (data.roleIds) user.roles = await this.roleRepo.find({ where: { id: In(data.roleIds) } });
    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async delete(id: string) {
    await this.userRepo.delete(id);
  }

  private sanitize(user: UserOrmEntity) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
