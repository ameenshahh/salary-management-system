'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clientApi } from '@/lib/client-api';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: { key: string }[];
}

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    clientApi<Role[]>('GET', '/roles').then(setRoles).catch(() => setRoles([]));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Roles</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {role.name}
                {role.isSystem && <Badge variant="secondary">System</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.map((p) => (
                  <Badge key={p.key} variant="outline">
                    {p.key}
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
