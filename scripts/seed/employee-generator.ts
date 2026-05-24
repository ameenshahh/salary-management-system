import seedrandom from 'seedrandom';
import { getCurrencyForCountry } from '@sms/shared';

const COUNTRIES = ['US', 'GB', 'IN', 'DE', 'FR', 'JP', 'AU', 'CA'];
const JOB_TITLES = [
  'Software Engineer',
  'Senior Engineer',
  'Engineering Manager',
  'Product Manager',
  'Data Analyst',
  'HR Specialist',
  'Sales Representative',
  'Marketing Manager',
  'Designer',
  'Finance Analyst',
  'Operations Manager',
  'Support Engineer',
];
const DEPARTMENTS = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];

const SALARY_RANGES: Record<string, [number, number]> = {
  US: [60000, 200000],
  GB: [35000, 120000],
  IN: [500000, 3000000],
  DE: [45000, 110000],
  FR: [40000, 100000],
  JP: [4000000, 12000000],
  AU: [70000, 150000],
  CA: [55000, 130000],
};

export interface EmployeeRow {
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  department: string;
  email: string;
  hireDate: string;
  status: string;
}

export function buildFullName(first: string, last: string): string {
  return `${first} ${last}`;
}

export function generateEmployeeRow(
  firstNames: string[],
  lastNames: string[],
  index: number,
  seed: string,
): EmployeeRow {
  const rng = seedrandom(`${seed}-${index}`);
  const first = firstNames[Math.floor(rng() * firstNames.length)];
  const last = lastNames[Math.floor(rng() * lastNames.length)];
  const country = COUNTRIES[Math.floor(rng() * COUNTRIES.length)];
  const [min, max] = SALARY_RANGES[country];
  const salary = Math.round(min + rng() * (max - min));
  const currency = getCurrencyForCountry(country) ?? 'USD';
  const jobTitle = JOB_TITLES[Math.floor(rng() * JOB_TITLES.length)];
  const department = DEPARTMENTS[Math.floor(rng() * DEPARTMENTS.length)];
  const status = rng() > 0.05 ? 'active' : 'inactive';
  const year = 2015 + Math.floor(rng() * 10);
  const month = 1 + Math.floor(rng() * 12);
  const day = 1 + Math.floor(rng() * 28);
  return {
    fullName: buildFullName(first, last),
    jobTitle,
    country,
    salary,
    currency,
    department,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@company.local`,
    hireDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    status,
  };
}

export function generateEmployees(
  count: number,
  firstNames: string[],
  lastNames: string[],
  seed = 'sms-seed',
): EmployeeRow[] {
  return Array.from({ length: count }, (_, i) =>
    generateEmployeeRow(firstNames, lastNames, i, seed),
  );
}
