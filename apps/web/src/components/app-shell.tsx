'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/employees', label: 'Employees' },
  { href: '/insights', label: 'Insights' },
  { href: '/admin/roles', label: 'Roles' },
  { href: '/admin/users', label: 'Users' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 flex-col gap-2 border-r border-border bg-card p-4">
        <div className="mb-4 px-2">
          <p className="text-lg font-semibold">Salary MS</p>
          <p className="text-xs text-muted-foreground">HR Management</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                pathname === link.href && 'bg-accent font-medium',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" className="mt-auto" onClick={logout}>
          Sign out
        </Button>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-sm font-medium text-muted-foreground">HR Manager Portal</h1>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
