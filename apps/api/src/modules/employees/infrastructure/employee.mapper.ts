import { Employee } from '../domain/employee.entity';
import { EmployeeOrmEntity } from './employee.orm-entity';

export function toDomain(entity: EmployeeOrmEntity): Employee {
  return Employee.create({
    id: entity.id,
    fullName: entity.fullName,
    jobTitle: entity.jobTitle,
    country: entity.country,
    salary: parseFloat(entity.salary),
    currency: entity.currency,
    department: entity.department,
    email: entity.email,
    hireDate: new Date(entity.hireDate),
    status: entity.status as 'active' | 'inactive',
  });
}

export function toOrm(employee: Employee): Partial<EmployeeOrmEntity> {
  return {
    id: employee.id,
    fullName: employee.fullName,
    jobTitle: employee.jobTitle,
    country: employee.country,
    salary: employee.salary.toFixed(2),
    currency: employee.currency,
    department: employee.department,
    email: employee.email,
    hireDate: employee.hireDate.toISOString().split('T')[0],
    status: employee.status,
  };
}
