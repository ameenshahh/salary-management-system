import { Employee } from './employee.entity';

describe('Employee', () => {
  it('creates employee with auto currency from country', () => {
    const employee = Employee.create({
      fullName: 'Jane Doe',
      jobTitle: 'Engineer',
      country: 'US',
      salary: 100000,
      department: 'Engineering',
      email: 'jane@example.com',
      hireDate: new Date('2024-01-01'),
    });
    expect(employee.currency).toBe('USD');
  });

  it('rejects negative quantity salary', () => {
    expect(() =>
      Employee.create({
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'US',
        salary: -1,
        department: 'Engineering',
        email: 'jane@example.com',
        hireDate: new Date('2024-01-01'),
      }),
    ).toThrow('Salary must be non-negative');
  });

  it('rejects unsupported country', () => {
    expect(() =>
      Employee.create({
        fullName: 'Jane Doe',
        jobTitle: 'Engineer',
        country: 'XX',
        salary: 100000,
        department: 'Engineering',
        email: 'jane@example.com',
        hireDate: new Date('2024-01-01'),
      }),
    ).toThrow('Unsupported country');
  });
});
