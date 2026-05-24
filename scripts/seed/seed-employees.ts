import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { Client } from 'pg';
import { from as copyFrom } from 'pg-copy-streams';
import { Readable } from 'stream';
import { generateEmployees } from './employee-generator';

config({ path: join(__dirname, '../../.env') });

function loadNames(filename: string): string[] {
  const path = join(__dirname, '../data', filename);
  return readFileSync(path, 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function toCopyLine(row: ReturnType<typeof generateEmployees>[0]): string {
  const cols = [
    row.fullName,
    row.jobTitle,
    row.country,
    row.salary.toFixed(2),
    row.currency,
    row.department,
    row.email,
    row.hireDate,
    row.status,
  ];
  return cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join('\t');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const fresh = args.includes('--fresh');
  const countArg = args.find((a) => a.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) : 10000;

  const firstNames = loadNames('first_names.txt');
  const lastNames = loadNames('last_names.txt');
  const rows = generateEmployees(count, firstNames, lastNames);

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  if (fresh) {
    await client.query('TRUNCATE employees RESTART IDENTITY CASCADE');
  }

  const start = Date.now();
  const copyStream = client.query(
    copyFrom(
      `COPY employees (full_name, job_title, country, salary, currency, department, email, hire_date, status) FROM STDIN WITH (FORMAT csv, DELIMITER E'\\t', NULL '')`,
    ),
  );

  const data = rows.map(toCopyLine).join('\n') + '\n';
  await new Promise<void>((resolve, reject) => {
    const readable = Readable.from([data]);
    readable.pipe(copyStream);
    copyStream.on('finish', resolve);
    copyStream.on('error', reject);
  });

  const elapsed = Date.now() - start;
  console.log(`Seeded ${count} employees in ${elapsed}ms`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
