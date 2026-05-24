import { describe, it, expect } from 'vitest';
import { getCurrencyForCountry } from './country-currency';

describe('getCurrencyForCountry', () => {
  it('returns USD for US', () => {
    expect(getCurrencyForCountry('US')).toBe('USD');
  });

  it('returns GBP for GB', () => {
    expect(getCurrencyForCountry('GB')).toBe('GBP');
  });

  it('returns INR for IN', () => {
    expect(getCurrencyForCountry('IN')).toBe('INR');
  });

  it('returns null for unknown country', () => {
    expect(getCurrencyForCountry('XX')).toBeNull();
  });
});
