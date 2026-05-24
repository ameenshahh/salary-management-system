'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { clientApi } from '@/lib/client-api';
import { formatSalary } from '@/lib/format';
import { toast } from 'sonner';

interface Employee {
  id: string;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  department: string;
  email: string;
  status: string;
}

interface Paginated {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
}

export default function EmployeesPage() {
  const [data, setData] = useState<Paginated | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    try {
      const result = await clientApi<Paginated>('GET', `/employees?${params}`);
      setData(result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this employee?')) return;
    try {
      await clientApi('DELETE', `/employees/${id}`);
      toast.success('Employee deleted');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <Link href="/employees/new">
          <Button>Add employee</Button>
        </Link>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="secondary" onClick={() => { setPage(1); load(); }}>
          Search
        </Button>
      </div>
      {data && (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {data.items.length} of {data.total.toLocaleString()}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.fullName}</TableCell>
                  <TableCell>{emp.jobTitle}</TableCell>
                  <TableCell>{emp.country}</TableCell>
                  <TableCell>{formatSalary(emp.currency, emp.salary)}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Link href={`/employees/${emp.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(emp.id!)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2">
            <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button disabled={page * 20 >= data.total} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
