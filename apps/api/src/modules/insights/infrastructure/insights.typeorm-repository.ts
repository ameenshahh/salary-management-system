import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeOrmEntity } from '../../employees/infrastructure/employee.orm-entity';
import {
  CountryInsights,
  CountrySummary,
  CurrencyStats,
  InsightsRepositoryPort,
  InsightsSummary,
  JobTitleInsight,
} from '../domain/insights.repository.port';

@Injectable()
export class InsightsTypeOrmRepository implements InsightsRepositoryPort {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly repo: Repository<EmployeeOrmEntity>,
  ) {}

  async getSummary(): Promise<InsightsSummary> {
    const total = await this.repo.count();
    const activeCount = await this.repo.count({ where: { status: 'active' } });
    const countries = await this.repo
      .createQueryBuilder('e')
      .select('COUNT(DISTINCT e.country)', 'count')
      .getRawOne<{ count: string }>();
    const avgByCurrency = await this.repo
      .createQueryBuilder('e')
      .select('e.currency', 'currency')
      .addSelect('AVG(e.salary::numeric)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.currency')
      .getRawMany<{ currency: string; avg: string; count: string }>();
    return {
      totalEmployees: total,
      activeCount,
      countriesCount: parseInt(countries?.count ?? '0', 10),
      avgSalaryByCurrency: avgByCurrency.map((r) => ({
        currency: r.currency,
        avg: parseFloat(r.avg),
        count: parseInt(r.count, 10),
      })),
    };
  }

  async getByCountry(country: string): Promise<CountryInsights> {
    const stats = await this.fetchCurrencyStats('e.country = :country', { country: country.toUpperCase() });
    const count = stats.reduce((sum, s) => sum + s.count, 0);
    return { country: country.toUpperCase(), count, stats };
  }

  async getByCountryJob(country: string, jobTitle: string): Promise<CountryInsights> {
    const stats = await this.fetchCurrencyStats(
      'e.country = :country AND e.job_title = :jobTitle',
      { country: country.toUpperCase(), jobTitle },
    );
    const count = stats.reduce((sum, s) => sum + s.count, 0);
    return { country: country.toUpperCase(), count, stats };
  }

  async getCountries(): Promise<CountrySummary[]> {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('e.country', 'country')
      .addSelect('e.currency', 'currency')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(e.salary::numeric)', 'avgSalary')
      .groupBy('e.country')
      .addGroupBy('e.currency')
      .orderBy('count', 'DESC')
      .getRawMany<{ country: string; currency: string; count: string; avgSalary: string }>();
    return rows.map((r) => ({
      country: r.country,
      currency: r.currency,
      count: parseInt(r.count, 10),
      avgSalary: parseFloat(r.avgSalary),
    }));
  }

  async getJobTitlesByCountry(country: string): Promise<JobTitleInsight[]> {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('e.job_title', 'jobTitle')
      .addSelect('e.currency', 'currency')
      .addSelect('AVG(e.salary::numeric)', 'avg')
      .addSelect('MIN(e.salary::numeric)', 'min')
      .addSelect('MAX(e.salary::numeric)', 'max')
      .addSelect('COUNT(*)', 'count')
      .where('e.country = :country', { country: country.toUpperCase() })
      .groupBy('e.job_title')
      .addGroupBy('e.currency')
      .orderBy('avg', 'DESC')
      .getRawMany<{ jobTitle: string; currency: string; avg: string; min: string; max: string; count: string }>();
    return rows.map((r) => ({
      jobTitle: r.jobTitle,
      currency: r.currency,
      avg: parseFloat(r.avg),
      min: parseFloat(r.min),
      max: parseFloat(r.max),
      count: parseInt(r.count, 10),
    }));
  }

  private async fetchCurrencyStats(
    where: string,
    params: Record<string, string>,
  ): Promise<CurrencyStats[]> {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('e.currency', 'currency')
      .addSelect('MIN(e.salary::numeric)', 'min')
      .addSelect('MAX(e.salary::numeric)', 'max')
      .addSelect('AVG(e.salary::numeric)', 'avg')
      .addSelect('PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.salary::numeric)', 'median')
      .addSelect('COUNT(*)', 'count')
      .where(where, params)
      .groupBy('e.currency')
      .getRawMany<{ currency: string; min: string; max: string; avg: string; median: string; count: string }>();
    return rows.map((r) => ({
      currency: r.currency,
      min: parseFloat(r.min),
      max: parseFloat(r.max),
      avg: parseFloat(r.avg),
      median: parseFloat(r.median),
      count: parseInt(r.count, 10),
    }));
  }
}
