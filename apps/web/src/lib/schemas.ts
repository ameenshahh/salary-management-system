import { z } from 'zod';

export const employeeSchema = z.object({
  fullName: z.string().min(2),
  jobTitle: z.string().min(1),
  country: z.string().length(2),
  salary: z.coerce.number().min(0),
  currency: z.string().length(3).optional(),
  department: z.string().min(1),
  email: z.string().email(),
  hireDate: z.string().min(1),
  status: z.enum(['active', 'inactive']).optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});
