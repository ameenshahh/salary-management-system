import { getCurrencyForCountry } from '@sms/shared';

export type EmployeeStatus = 'active' | 'inactive';

export interface EmployeeProps {
  id?: string;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency?: string;
  department: string;
  email: string;
  hireDate: Date;
  status?: EmployeeStatus;
}

export class Employee {
  readonly id?: string;
  readonly fullName: string;
  readonly jobTitle: string;
  readonly country: string;
  readonly salary: number;
  readonly currency: string;
  readonly department: string;
  readonly email: string;
  readonly hireDate: Date;
  readonly status: EmployeeStatus;

  private constructor(props: EmployeeProps & { currency: string }) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.jobTitle = props.jobTitle;
    this.country = props.country.toUpperCase();
    this.salary = props.salary;
    this.currency = props.currency;
    this.department = props.department;
    this.email = props.email;
    this.hireDate = props.hireDate;
    this.status = props.status ?? 'active';
  }

  static create(props: EmployeeProps): Employee {
    Employee.validateSalary(props.salary);
    const currency = props.currency ?? getCurrencyForCountry(props.country);
    if (!currency) {
      throw new Error(`Unsupported country: ${props.country}`);
    }
    return new Employee({ ...props, currency });
  }

  private static validateSalary(salary: number): void {
    if (salary < 0) {
      throw new Error('Salary must be non-negative');
    }
  }
}
