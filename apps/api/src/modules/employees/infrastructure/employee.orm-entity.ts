import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class EmployeeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ name: 'job_title' })
  jobTitle!: string;

  @Column({ length: 2 })
  country!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  salary!: string;

  @Column({ length: 3 })
  currency!: string;

  @Column()
  department!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate!: string;

  @Column({ default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
