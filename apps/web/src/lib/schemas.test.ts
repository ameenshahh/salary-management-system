import { describe, it, expect } from 'vitest';
import { employeeSchema } from './schemas';

describe('employeeSchema', () => {
  it('rejects negative salary', () => {
    const result = employeeSchema.safeParse({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'US',
      salary: -100,
      department: 'Engineering',
      email: 'jane@example.com',
      hireDate: '2024-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid employee', () => {
    const result = employeeSchema.safeParse({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'US',
      salary: 100000,
      department: 'Engineering',
      email: 'jane@example.com',
      hireDate: '2024-01-01',
    });
    expect(result.success).toBe(true);
  });
});
