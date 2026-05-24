# Trade-offs

| Decision | Why |
|----------|-----|
| TypeORM vs Prisma | Nest integration, migration control |
| Redis cache | Insights are read-heavy at 10k scale |
| Monorepo | Shared permissions/currency map |
| COPY seed | ORM insert too slow for 10k repeated runs |
| Permission keys fixed | Admin manages roles/users, not new permission types |
| Complexity ≤ 5 | ESLint enforced; use cases stay small |
