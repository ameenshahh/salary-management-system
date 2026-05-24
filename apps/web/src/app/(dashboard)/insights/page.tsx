'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clientApi } from '@/lib/client-api';
import { formatSalary } from '@/lib/format';

interface CountryInsights {
  country: string;
  count: number;
  stats: { currency: string; min: number; max: number; avg: number; median: number; count: number }[];
}

interface JobInsight {
  jobTitle: string;
  currency: string;
  avg: number;
  count: number;
}

export default function InsightsPage() {
  const [countries, setCountries] = useState<{ country: string; count: number }[]>([]);
  const [country, setCountry] = useState('US');
  const [insights, setInsights] = useState<CountryInsights | null>(null);
  const [jobs, setJobs] = useState<JobInsight[]>([]);

  useEffect(() => {
    clientApi<{ country: string; count: number }[]>('GET', '/insights/countries').then((rows) => {
      setCountries(rows);
      if (rows[0]) setCountry(rows[0].country);
    });
  }, []);

  useEffect(() => {
    if (!country) return;
    clientApi<CountryInsights>('GET', `/insights/by-country?country=${country}`).then(setInsights);
    clientApi<JobInsight[]>('GET', `/insights/job-titles?country=${country}`).then(setJobs);
  }, [country]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Salary insights</h2>
      <div className="max-w-xs">
        <Select value={country} onValueChange={(v) => v && setCountry(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.country} value={c.country}>
                {c.country} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {insights && (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.stats.map((stat) => (
            <Card key={stat.currency}>
              <CardHeader>
                <CardTitle>
                  {insights.country} — {stat.currency}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                <p>Employees: {stat.count}</p>
                <p>Min: {formatSalary(stat.currency, stat.min)}</p>
                <p>Max: {formatSalary(stat.currency, stat.max)}</p>
                <p>Avg: {formatSalary(stat.currency, stat.avg)}</p>
                <p>Median: {formatSalary(stat.currency, stat.median)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Average by job title</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {jobs.map((j) => (
              <li key={`${j.jobTitle}-${j.currency}`} className="flex justify-between text-sm">
                <span>{j.jobTitle}</span>
                <span>
                  {formatSalary(j.currency, j.avg)} ({j.count})
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
