# Salary Management System

HR salary management for organizations with **10,000+ employees**. Built with NestJS, PostgreSQL, Redis, Next.js, and shadcn/ui.

## Public repository

> **Add your GitHub repo URL here after pushing:**
> `https://github.com/YOUR_USERNAME/salary-management-system`

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

- **Web:** http://localhost:3000  
- **API:** http://localhost:3001/api/v1  
- **Default admin:** `admin@company.local` / `ChangeMe123456!`

### Seed 10,000 employees

```bash
pnpm install
pnpm seed:employees
# or: pnpm seed:employees --count=100
```

## Development

```bash
pnpm install
docker compose up postgres redis -d
pnpm --filter @sms/api migration:run
pnpm seed:bootstrap
pnpm --filter @sms/api start:dev   # :3001
pnpm --filter @sms/web dev         # :3000
```

## Tests

```bash
pnpm test
pnpm lint
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/SECURITY.md](docs/SECURITY.md), [docs/TDD.md](docs/TDD.md).

## Demo video

Record a walkthrough per [docs/DEMO.md](docs/DEMO.md) and add the link here.
