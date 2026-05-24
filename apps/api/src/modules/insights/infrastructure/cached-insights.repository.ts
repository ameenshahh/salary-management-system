import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import {
  CountryInsights,
  CountrySummary,
  InsightsRepositoryPort,
  InsightsSummary,
  JobTitleInsight,
} from '../domain/insights.repository.port';
import {
  insightsCountriesKey,
  insightsCountryJobKey,
  insightsCountryKey,
  insightsJobTitlesKey,
  insightsSummaryKey,
} from '../../../common/cache/cache-keys';
import { InsightsTypeOrmRepository } from './insights.typeorm-repository';

@Injectable()
export class CachedInsightsRepository implements InsightsRepositoryPort {
  constructor(
    private readonly inner: InsightsTypeOrmRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async getSummary(): Promise<InsightsSummary> {
    return this.cached(insightsSummaryKey(), () => this.inner.getSummary());
  }

  async getByCountry(country: string): Promise<CountryInsights> {
    return this.cached(insightsCountryKey(country), () => this.inner.getByCountry(country));
  }

  async getByCountryJob(country: string, jobTitle: string): Promise<CountryInsights> {
    return this.cached(insightsCountryJobKey(country, jobTitle), () =>
      this.inner.getByCountryJob(country, jobTitle),
    );
  }

  async getCountries(): Promise<CountrySummary[]> {
    return this.cached(insightsCountriesKey(), () => this.inner.getCountries());
  }

  async getJobTitlesByCountry(country: string): Promise<JobTitleInsight[]> {
    return this.cached(insightsJobTitlesKey(country), () =>
      this.inner.getJobTitlesByCountry(country),
    );
  }

  private async cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const hit = await this.cache.get<T>(key);
    if (hit) return hit;
    const value = await fn();
    await this.cache.set(key, value, 300000);
    return value;
  }
}
