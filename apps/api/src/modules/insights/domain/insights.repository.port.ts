export interface CurrencyStats {
  currency: string;
  min: number;
  max: number;
  avg: number;
  median: number;
  count: number;
}

export interface CountryInsights {
  country: string;
  count: number;
  stats: CurrencyStats[];
}

export interface JobTitleInsight {
  jobTitle: string;
  currency: string;
  avg: number;
  min: number;
  max: number;
  count: number;
}

export interface InsightsSummary {
  totalEmployees: number;
  activeCount: number;
  countriesCount: number;
  avgSalaryByCurrency: { currency: string; avg: number; count: number }[];
}

export interface CountrySummary {
  country: string;
  count: number;
  avgSalary: number;
  currency: string;
}

export interface InsightsRepositoryPort {
  getSummary(): Promise<InsightsSummary>;
  getByCountry(country: string): Promise<CountryInsights>;
  getByCountryJob(country: string, jobTitle: string): Promise<CountryInsights>;
  getCountries(): Promise<CountrySummary[]>;
  getJobTitlesByCountry(country: string): Promise<JobTitleInsight[]>;
}
