import { Injectable, Inject } from '@nestjs/common';
import { INSIGHTS_REPOSITORY } from '../../../common/tokens';
import { InsightsRepositoryPort } from '../domain/insights.repository.port';

@Injectable()
export class GetInsightsSummaryUseCase {
  constructor(@Inject(INSIGHTS_REPOSITORY) private readonly repo: InsightsRepositoryPort) {}

  execute() {
    return this.repo.getSummary();
  }
}

@Injectable()
export class GetInsightsByCountryUseCase {
  constructor(@Inject(INSIGHTS_REPOSITORY) private readonly repo: InsightsRepositoryPort) {}

  execute(country: string) {
    return this.repo.getByCountry(country);
  }
}

@Injectable()
export class GetInsightsByCountryJobUseCase {
  constructor(@Inject(INSIGHTS_REPOSITORY) private readonly repo: InsightsRepositoryPort) {}

  execute(country: string, jobTitle: string) {
    return this.repo.getByCountryJob(country, jobTitle);
  }
}

@Injectable()
export class GetInsightsCountriesUseCase {
  constructor(@Inject(INSIGHTS_REPOSITORY) private readonly repo: InsightsRepositoryPort) {}

  execute() {
    return this.repo.getCountries();
  }
}

@Injectable()
export class GetJobTitlesByCountryUseCase {
  constructor(@Inject(INSIGHTS_REPOSITORY) private readonly repo: InsightsRepositoryPort) {}

  execute(country: string) {
    return this.repo.getJobTitlesByCountry(country);
  }
}
