import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INSIGHTS_REPOSITORY } from '../../common/tokens';
import { EmployeeOrmEntity } from '../employees/infrastructure/employee.orm-entity';
import { InsightsTypeOrmRepository } from './infrastructure/insights.typeorm-repository';
import { CachedInsightsRepository } from './infrastructure/cached-insights.repository';
import {
  GetInsightsByCountryJobUseCase,
  GetInsightsByCountryUseCase,
  GetInsightsCountriesUseCase,
  GetInsightsSummaryUseCase,
  GetJobTitlesByCountryUseCase,
} from './application/insights.use-cases';
import { InvalidateInsightsCacheUseCase } from './application/invalidate-insights-cache.use-case';
import { InsightsController } from './presentation/insights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeOrmEntity])],
  controllers: [InsightsController],
  providers: [
    InsightsTypeOrmRepository,
    CachedInsightsRepository,
    {
      provide: INSIGHTS_REPOSITORY,
      useExisting: CachedInsightsRepository,
    },
    GetInsightsSummaryUseCase,
    GetInsightsByCountryUseCase,
    GetInsightsByCountryJobUseCase,
    GetInsightsCountriesUseCase,
    GetJobTitlesByCountryUseCase,
    InvalidateInsightsCacheUseCase,
  ],
  exports: [InvalidateInsightsCacheUseCase, INSIGHTS_REPOSITORY],
})
export class InsightsModule {}
