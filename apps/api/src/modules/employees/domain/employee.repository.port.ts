import { Employee } from './employee.entity';

export interface EmployeeListFilters {
  page: number;
  limit: number;
  search?: string;
  country?: string;
  jobTitle?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedEmployees {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeRepositoryPort {
  save(employee: Employee): Promise<Employee>;
  findById(id: string): Promise<Employee | null>;
  findAll(filters: EmployeeListFilters): Promise<PaginatedEmployees>;
  update(id: string, employee: Employee): Promise<Employee>;
  delete(id: string): Promise<void>;
}
