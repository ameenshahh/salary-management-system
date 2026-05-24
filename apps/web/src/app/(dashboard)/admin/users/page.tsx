'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clientApi } from '@/lib/client-api';

interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: { name: string }[];
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    clientApi<User[]>('GET', '/users').then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Users</h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.fullName}
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{user.email}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {user.roles?.map((r) => (
                  <Badge key={r.name} variant="outline">
                    {r.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
