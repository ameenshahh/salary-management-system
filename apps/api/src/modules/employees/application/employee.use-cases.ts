import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Employee } from '../domain/employee.entity';
import { EmployeeRepositoryPort } from '../domain/employee.repository.port';
import { EMPLOYEE_REPOSITORY } from '../../../common/tokens';
import { InvalidateInsightsCacheUseCase } from '../../insights/application/invalidate-insights-cache.use-case';

export interface CreateEmployeeInput {
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency?: string;
  department: string;
  email: string;
  hireDate: string;
  status?: 'active' | 'inactive';
}

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly repo: EmployeeRepositoryPort,
    private readonly cacheInvalidator: InvalidateInsightsCacheUseCase,
    @InjectPinoLogger(CreateEmployeeUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(input: CreateEmployeeInput): Promise<Employee> {
    const employee = Employee.create({
      ...input,
      hireDate: new Date(input.hireDate),
    });
    const saved = await this.repo.save(employee);
    await this.cacheInvalidator.execute();
    this.logger.info({ employeeId: saved.id, action: 'employee.created' });
    return saved;
  }
}

@Injectable()
export class GetEmployeeUseCase {
  constructor(@Inject(EMPLOYEE_REPOSITORY) private readonly repo: EmployeeRepositoryPort) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.repo.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }
}

@Injectable()
export class ListEmployeesUseCase {
  constructor(@Inject(EMPLOYEE_REPOSITORY) private readonly repo: EmployeeRepositoryPort) {}

  async execute(filters: Parameters<EmployeeRepositoryPort['findAll']>[0]) {
    return this.repo.findAll(filters);
  }
}

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly repo: EmployeeRepositoryPort,
    private readonly cacheInvalidator: InvalidateInsightsCacheUseCase,
    @InjectPinoLogger(UpdateEmployeeUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(id: string, input: CreateEmployeeInput): Promise<Employee> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Employee not found');
    }
    const employee = Employee.create({ ...input, id, hireDate: new Date(input.hireDate) });
    const updated = await this.repo.update(id, employee);
    await this.cacheInvalidator.execute();
    this.logger.info({ employeeId: id, action: 'employee.updated' });
    return updated;
  }
}

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly repo: EmployeeRepositoryPort,
    private readonly cacheInvalidator: InvalidateInsightsCacheUseCase,
    @InjectPinoLogger(DeleteEmployeeUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Employee not found');
    }
    await this.repo.delete(id);
    await this.cacheInvalidator.execute();
    this.logger.info({ employeeId: id, action: 'employee.deleted' });
  }
}
