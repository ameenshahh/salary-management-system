'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientApi } from '@/lib/client-api';
import { formatSalary } from '@/lib/format';

interface Summary {
  totalEmployees: number;
  activeCount: number;
  countriesCount: number;
  avgSalaryByCurrency: { currency: string; avg: number; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    clientApi<Summary>('GET', '/insights/summary')
      .then(setSummary)
      .catch(() => router.push('/login'));
  }, [router]);

  if (!summary) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalEmployees.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.activeCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.countriesCount}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Average salary by currency</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {summary.avgSalaryByCurrency.map((row) => (
              <li key={row.currency} className="flex justify-between text-sm">
                <span>{row.currency}</span>
                <span>{formatSalary(row.currency, row.avg)} ({row.count} employees)</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
