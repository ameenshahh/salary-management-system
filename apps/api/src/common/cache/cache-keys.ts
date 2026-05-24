export const INSIGHTS_CACHE_PREFIX = 'insights:';
export const PERMISSIONS_CACHE_PREFIX = 'auth:permissions:';

export function insightsSummaryKey(): string {
  return `${INSIGHTS_CACHE_PREFIX}summary`;
}

export function insightsCountryKey(country: string): string {
  return `${INSIGHTS_CACHE_PREFIX}country:${country.toUpperCase()}`;
}

export function insightsCountryJobKey(country: string, jobTitle: string): string {
  return `${INSIGHTS_CACHE_PREFIX}country:${country.toUpperCase()}:job:${jobTitle}`;
}

export function insightsCountriesKey(): string {
  return `${INSIGHTS_CACHE_PREFIX}countries`;
}

export function insightsJobTitlesKey(country: string): string {
  return `${INSIGHTS_CACHE_PREFIX}job-titles:${country.toUpperCase()}`;
}

export function permissionsCacheKey(userId: string): string {
  return `${PERMISSIONS_CACHE_PREFIX}${userId}`;
}

export const ALL_INSIGHTS_KEYS = [
  insightsSummaryKey(),
  insightsCountriesKey(),
];
