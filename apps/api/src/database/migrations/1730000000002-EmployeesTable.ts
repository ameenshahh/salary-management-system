import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeesTable1730000000002 implements MigrationInterface {
  name = 'EmployeesTable1730000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(150) NOT NULL,
        country CHAR(2) NOT NULL,
        salary DECIMAL(12,2) NOT NULL CHECK (salary >= 0),
        currency CHAR(3) NOT NULL,
        department VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        hire_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_employees_country ON employees(country);
      CREATE INDEX IF NOT EXISTS idx_employees_job_title ON employees(job_title);
      CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
      CREATE INDEX IF NOT EXISTS idx_employees_country_job ON employees(country, job_title);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS employees;`);
  }
}
