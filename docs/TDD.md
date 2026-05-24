# TDD approach

We followed **red → green → refactor** with small commits.

## Examples from this repo

1. **Shared:** `country-currency.test.ts` before `country-currency.ts`
2. **API:** `employee.entity.spec.ts` before employee domain rules
3. **API:** `rbac.guard.spec.ts` before guard usage on controllers
4. **Scripts:** `employee-generator.test.ts` before `seed-employees.ts`
5. **Web:** `schemas.test.ts` / `format.test.ts` before UI pages

## Reference

[Kent Beck TDD overview](https://www.youtube.com/watch?v=qkblc5WRn-U&t=3s)

## Running tests

```bash
pnpm test
```
