import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS, PermissionKey } from '@sms/shared';
import { RbacGuard } from '../../../common/security/rbac.guard';
import { RequirePermissions } from '../../../common/security/require-permissions.decorator';
import {
  GetInsightsByCountryJobUseCase,
  GetInsightsByCountryUseCase,
  GetInsightsCountriesUseCase,
  GetInsightsSummaryUseCase,
  GetJobTitlesByCountryUseCase,
} from '../application/insights.use-cases';

@Controller('insights')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@RequirePermissions(PERMISSIONS.INSIGHTS_READ as PermissionKey)
export class InsightsController {
  constructor(
    private readonly summary: GetInsightsSummaryUseCase,
    private readonly byCountry: GetInsightsByCountryUseCase,
    private readonly byCountryJob: GetInsightsByCountryJobUseCase,
    private readonly countries: GetInsightsCountriesUseCase,
    private readonly jobTitles: GetJobTitlesByCountryUseCase,
  ) {}

  @Get('summary')
  getSummary() {
    return this.summary.execute();
  }

  @Get('by-country')
  getByCountry(@Query('country') country: string) {
    return this.byCountry.execute(country);
  }

  @Get('by-country-job')
  getByCountryJob(@Query('country') country: string, @Query('jobTitle') jobTitle: string) {
    return this.byCountryJob.execute(country, jobTitle);
  }

  @Get('countries')
  getCountries() {
    return this.countries.execute();
  }

  @Get('job-titles')
  getJobTitles(@Query('country') country: string) {
    return this.jobTitles.execute(country);
  }
}
