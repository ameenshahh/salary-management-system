import { EmployeeListFilters, PaginatedEmployees } from '../domain/employee.repository.port';
import { SelectQueryBuilder } from 'typeorm';
import { EmployeeOrmEntity } from './employee.orm-entity';

export function applyEmployeeFilters(
  qb: SelectQueryBuilder<EmployeeOrmEntity>,
  filters: EmployeeListFilters,
): SelectQueryBuilder<EmployeeOrmEntity> {
  if (filters.search) {
    qb.andWhere('(e.full_name ILIKE :search OR e.email ILIKE :search)', {
      search: `%${filters.search}%`,
    });
  }
  if (filters.country) {
    qb.andWhere('e.country = :country', { country: filters.country.toUpperCase() });
  }
  if (filters.jobTitle) {
    qb.andWhere('e.job_title = :jobTitle', { jobTitle: filters.jobTitle });
  }
  if (filters.status) {
    qb.andWhere('e.status = :status', { status: filters.status });
  }
  return qb;
}

export function applyEmployeeSort(
  qb: SelectQueryBuilder<EmployeeOrmEntity>,
  sortBy?: string,
  sortOrder: 'ASC' | 'DESC' = 'ASC',
): SelectQueryBuilder<EmployeeOrmEntity> {
  const allowed: Record<string, string> = {
    fullName: 'e.full_name',
    salary: 'e.salary',
    hireDate: 'e.hire_date',
  };
  const column = allowed[sortBy ?? 'fullName'] ?? 'e.full_name';
  return qb.orderBy(column, sortOrder);
}

export function normalizePagination(page: number, limit: number): { page: number; limit: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return { page: safePage, limit: safeLimit };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedEmployees {
  return { items: items as never, total, page, limit };
}
