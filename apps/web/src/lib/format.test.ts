import { describe, it, expect } from 'vitest';
import { formatSalary } from './format';

describe('formatSalary', () => {
  it('formats USD amounts', () => {
    const formatted = formatSalary('USD', 100000);
    expect(formatted).toContain('100');
  });
});
