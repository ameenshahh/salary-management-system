import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../domain/employee.entity';
import {
  EmployeeListFilters,
  EmployeeRepositoryPort,
  PaginatedEmployees,
} from '../domain/employee.repository.port';
import { EmployeeOrmEntity } from './employee.orm-entity';
import { toDomain, toOrm } from './employee.mapper';
import {
  applyEmployeeFilters,
  applyEmployeeSort,
  normalizePagination,
} from './employee-query.helpers';

@Injectable()
export class EmployeeTypeOrmRepository implements EmployeeRepositoryPort {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly repo: Repository<EmployeeOrmEntity>,
  ) {}

  async save(employee: Employee): Promise<Employee> {
    const entity = this.repo.create(toOrm(employee));
    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async findById(id: string): Promise<Employee | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? toDomain(entity) : null;
  }

  async findAll(filters: EmployeeListFilters): Promise<PaginatedEmployees> {
    const { page, limit } = normalizePagination(filters.page, filters.limit);
    const qb = this.repo.createQueryBuilder('e');
    applyEmployeeFilters(qb, filters);
    applyEmployeeSort(qb, filters.sortBy, filters.sortOrder ?? 'ASC');
    const [entities, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      items: entities.map(toDomain),
      total,
      page,
      limit,
    };
  }

  async update(id: string, employee: Employee): Promise<Employee> {
    await this.repo.update(id, toOrm(employee));
    const updated = await this.repo.findOneOrFail({ where: { id } });
    return toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
