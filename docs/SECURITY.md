# Security (OWASP Top 10)

| ID | Control |
|----|---------|
| A01 | JWT + `@RequirePermissions()` RBAC on all protected routes |
| A02 | bcrypt (cost 12), secrets via env only |
| A03 | TypeORM parameterized queries, DTO validation |
| A04 | `@Throttle` on login (5/min) |
| A05 | Helmet, CORS whitelist, ValidationPipe whitelist |
| A06 | `pnpm audit` in CI |
| A07 | Short JWT expiry, httpOnly cookies, password min 12 chars |
| A08 | Committed lockfile, frozen CI installs |
| A09 | Pino security events (failed login, 403) |
| A10 | No user-controlled outbound URLs |

See implementation in `apps/api/src/common/security/`.
