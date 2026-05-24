# Performance

## Employee seed (10k)

- Uses PostgreSQL `COPY` via `pg-copy-streams`
- Target: under 5 seconds on local Docker
- Run: `pnpm seed:employees`

## API

- Indexes on `country`, `job_title`, `status`, `(country, job_title)`
- Server-side pagination (max 100 per page)
- Redis cache on insights aggregates (5 min TTL)

## Caching invalidation

Employee create/update/delete triggers `InvalidateInsightsCacheUseCase`.
