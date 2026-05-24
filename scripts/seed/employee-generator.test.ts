import { describe, it, expect } from 'vitest';
import { buildFullName, generateEmployeeRow } from './employee-generator';

describe('employee-generator', () => {
  it('buildFullName combines first and last', () => {
    expect(buildFullName('John', 'Smith')).toBe('John Smith');
  });

  it('generateEmployeeRow produces valid fields', () => {
    const row = generateEmployeeRow(['John'], ['Smith'], 0, 'test-seed');
    expect(row.fullName).toBe('John Smith');
    expect(row.country).toHaveLength(2);
    expect(row.salary).toBeGreaterThan(0);
    expect(row.currency).toBeTruthy();
  });
});
