import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  jobTitle!: string;

  @IsString()
  @MinLength(2)
  country!: string;

  @IsNumber()
  @Min(0)
  salary!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  department!: string;

  @IsEmail()
  email!: string;

  @IsString()
  hireDate!: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class UpdateEmployeeDto extends CreateEmployeeDto {}

export class ListEmployeesQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
