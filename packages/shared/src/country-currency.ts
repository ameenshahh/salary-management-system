const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  DE: 'EUR',
  FR: 'EUR',
  JP: 'JPY',
  AU: 'AUD',
  CA: 'CAD',
};

export function getCurrencyForCountry(countryCode: string): string | null {
  const normalized = countryCode.toUpperCase();
  return COUNTRY_CURRENCY_MAP[normalized] ?? null;
}

export function isSupportedCountry(countryCode: string): boolean {
  return getCurrencyForCountry(countryCode) !== null;
}
