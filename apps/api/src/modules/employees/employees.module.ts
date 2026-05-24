import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMPLOYEE_REPOSITORY } from '../../common/tokens';
import { EmployeeOrmEntity } from './infrastructure/employee.orm-entity';
import { EmployeeTypeOrmRepository } from './infrastructure/employee.typeorm-repository';
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  GetEmployeeUseCase,
  ListEmployeesUseCase,
  UpdateEmployeeUseCase,
} from './application/employee.use-cases';
import { EmployeesController } from './presentation/employees.controller';
import { InsightsModule } from '../insights/insights.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeOrmEntity]), InsightsModule],
  controllers: [EmployeesController],
  providers: [
    CreateEmployeeUseCase,
    GetEmployeeUseCase,
    ListEmployeesUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    {
      provide: EMPLOYEE_REPOSITORY,
      useClass: EmployeeTypeOrmRepository,
    },
  ],
})
export class EmployeesModule {}
