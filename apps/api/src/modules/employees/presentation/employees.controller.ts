import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS, PermissionKey } from '@sms/shared';
import { RbacGuard } from '../../../common/security/rbac.guard';
import { RequirePermissions } from '../../../common/security/require-permissions.decorator';
import {
  CreateEmployeeUseCase,
  DeleteEmployeeUseCase,
  GetEmployeeUseCase,
  ListEmployeesUseCase,
  UpdateEmployeeUseCase,
} from '../application/employee.use-cases';
import { CreateEmployeeDto, ListEmployeesQueryDto, UpdateEmployeeDto } from './employee.dto';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RbacGuard)
export class EmployeesController {
  constructor(
    private readonly createEmployee: CreateEmployeeUseCase,
    private readonly getEmployee: GetEmployeeUseCase,
    private readonly listEmployees: ListEmployeesUseCase,
    private readonly updateEmployee: UpdateEmployeeUseCase,
    private readonly deleteEmployee: DeleteEmployeeUseCase,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.EMPLOYEES_READ as PermissionKey)
  list(@Query() query: ListEmployeesQueryDto) {
    return this.listEmployees.execute({
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 20),
      search: query.search,
      country: query.country,
      jobTitle: query.jobTitle,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.EMPLOYEES_READ as PermissionKey)
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.getEmployee.execute(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.EMPLOYEES_WRITE as PermissionKey)
  create(@Body() dto: CreateEmployeeDto) {
    return this.createEmployee.execute(dto);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.EMPLOYEES_WRITE as PermissionKey)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEmployeeDto) {
    return this.updateEmployee.execute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.EMPLOYEES_WRITE as PermissionKey)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteEmployee.execute(id);
  }
}
