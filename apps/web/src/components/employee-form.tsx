'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clientApi } from '@/lib/client-api';
import { toast } from 'sonner';

interface EmployeeFormProps {
  employeeId?: string;
}

export function EmployeeForm({ employeeId }: EmployeeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    country: 'US',
    salary: '',
    department: 'Engineering',
    email: '',
    hireDate: '',
    status: 'active',
  });

  useEffect(() => {
    if (!employeeId) return;
    clientApi<typeof form & { salary: number }>('GET', `/employees/${employeeId}`).then((emp) => {
      setForm({
        fullName: emp.fullName,
        jobTitle: emp.jobTitle,
        country: emp.country,
        salary: String(emp.salary),
        department: emp.department,
        email: emp.email,
        hireDate: emp.hireDate?.toString().slice(0, 10) ?? '',
        status: emp.status ?? 'active',
      });
    });
  }, [employeeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      salary: Number(form.salary),
      status: form.status as 'active' | 'inactive',
    };
    try {
      if (employeeId) {
        await clientApi('PATCH', `/employees/${employeeId}`, payload);
        toast.success('Employee updated');
      } else {
        await clientApi('POST', '/employees', payload);
        toast.success('Employee created');
      }
      router.push('/employees');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{employeeId ? 'Edit employee' : 'New employee'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Full name</Label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Job title</Label>
            <Input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Country (ISO)</Label>
            <Input value={form.country} maxLength={2} onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Salary</Label>
            <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Department</Label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Hire date</Label>
            <Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </CardContent>
    </Card>
  );
}
